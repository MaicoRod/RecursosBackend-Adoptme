import supertest from 'supertest';
import chai from 'chai';
import mongose from 'mongoose';

const expect = chai.expect;
const requester = supertest('http://localhost:8080');

describe('Adoptions Router Tests', function(){
    this.timeout(10000);

    let testUserId;
    let testPetId;
    let testAdoptionId;

    before(async function() {
        if (mongose.connection.readyState === 0) {
            await mongose.connect('mongodb://localhost:27017/adoptme');
        }

        const userResponse = await requester
            .post('/api/sessions/register')
            .send({
                first_name: 'Test',
                last_name: 'User',
                email: `test.adoption.${Date.now()}@example.com`,
                password: 'contraseña123'
            });

        testUserId = userResponse.body.payload;

        const petResponse = await requester
            .post('/api/pets')
            .send({
                name: 'Test Pet',
                specie: 'Dog',
                birthDate: '2020-01-01'
            });

            testPetId = petResponse.body.payload._id; 
    });

    after(async function() {
        
        if (testUserId) {
            await requester.delete(`/api/users/${testUserId}`);
        }

        if (testPetId) {
            await requester.delete(`/api/pets/${testPetId}`);
        }
    });

    describe('GET /api/adoptions', () =>{
        it('Debe obtener todas las adopciones', async () =>{
            const response = await requester.get('/api/adoptions');

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('status').that.equals('success');
            expect(response.body).to.have.property('payload');
            expect(response.body.payload).to.be.an('array');
        });

        it('Debe devolver un array aunque este vacio', async () => {
            const response = await requester.get('/api/adoptions');

            expect(response.body.payload).to.be.an('array');
        });
    });

    describe('POST /api/adoptions/:uid/:pid', () => {
        it('Debe crear una adopcion exitosamente con usuario y mascota validos', async () => {
            const response = await requester
            .post(`/api/adoptions/${testUserId}/${testPetId}`);

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('status').that.equals('success');
            expect(response.body).to.have.property('message').that.equals('Pet adopted');

            const adoptionsResponse = await requester.get('/api/adoptions');
            const adoptions = adoptionsResponse.body.payload;
            const adoption = adoptions.find(a =>
                a.owner.toString() === testUserId &&
                a.pet.toString() === testPetId
            );

            if (adoption) {
                testAdoptionId = adoption._id;
            }
        });

        it('Debe fallar si el usuario no existe', async () => {
            const fakeUserId = '507f1f77bcf86cd799439011';

            const response = await requester
                .post(`/api/adoptions/${fakeUserId}/${testPetId}`);

                expect(response.status).to.equal(404);
                expect(response.body).to.have.property('status').that.equals('error');
                expect(response.body.error).to.have.property('code').that.equals('USER_NOT_FOUND');
        });

        it('Debe fallar si la mascota no existe', async () => {
            const fakePetId = '507f1f77bcf86cd799439011';

            const userResponse = await requester
                .post('/api/sessions/register')
                .send({
                    first_name: 'Test',
                    last_name: 'User 2',
                    email: `test.adoption2.${Date.now()}@ejemplo.com`,
                    password: 'contraseña123'
                });

                const userId = userResponse.body.payload;

                const response = await requester
                    .post(`/api/adoptions/${userId}/${fakePetId}`);

            expect(response.status).to.equal(404);
            expect(response.body).to.have.property('status').that.equals('error');
            expect(response.body.error).to.have.property('code').that.equals('PET_NOT_FOUND');    

            await requester.delete(`/api/users/${userId}`);
        });

        it('Debe fallar si la mascota ya esta adoptada', async () => {

            const petResponse = await requester
                .post('/api/pets')
                .send({
                    name: 'Mascota ya adoptada',
                    specie: 'Cat',
                    birthDate: '2021-01-01'
                });

            const petId = petResponse.body.payload._id
            
            const userResponse = await requester
                .post('/api/sessions/register')
                .send({
                    first_name: 'Test',
                    last_name: 'User3',
                    email: `test.adoption3.${Date.now()}@ejemplo.com`,
                    password: 'contraseña123'
                });

            const userId = userResponse.body.payload;
            
            await requester.post(`/api/adoptions/${userId}/${petId}`);

            const userDosResponse = await requester
                .post('/api/sessions/register')
                .send({
                    first_name: 'Test',
                    last_name: 'User4',
                    email: `test.adoption4.${Date.now()}@ejemplo.com`,
                    password: 'contraseña123'
                });

            const userDosId = userDosResponse.body.payload;

            const response = await requester
                .post(`/api/adoptions/${userDosId}/${petId}`);

            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('status').that.equals('error');
            expect(response.body.error).to.have.property('code').that.equals('PET_ALREADY_ADOPTED');

            await requester.delete(`/api/users/${userId}`);
            await requester.delete(`/api/users/${userDosId}`);    
            await requester.delete(`/api/pets/${petId}`);    
        });

        it('Debe fallar con Id de usuario invalido', async () => {

            const invalidUserId = 'invalid-id';

            const response = await requester
                .post(`/api/adoptions/${invalidUserId}/${testPetId}`);

            expect(response.status).to.be.oneOf([400, 404]);
            expect(response.body).to.have.property('status').that.equals('error');
        });

        it('Debe fallar con Id de mascota invalido', async () => {
            
            const invalidPetId = 'invalid-id';

            const response = await requester
                .post(`/api/adoptions/${testUserId}/${invalidPetId}`);

            expect(response.status).to.be.oneOf([400, 404]);
            expect(response.body).to.have.property('status').that.equals('error');
        });
    });

    describe('GET /api/adoptions/:aid', () => {

        it('Debe obtener una adopcion por Id', async () => {
            if(!testAdoptionId) {
                this.skip();
            }

            const response = await requester
                .get(`/api/adoptions/${testAdoptionId}`);

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('status').that.equals('success');
            expect(response.body).to.have.property('payload');
            expect(response.body.payload).to.have.property('_id').that.equals(testAdoptionId);
            expect(response.body.payload).to.have.property('owner');
            expect(response.body.payload).to.have.property('pet');
        });

        it('Debe traer 404 si no existe la adopcion', async () => {

            const fakeAdoptionId = '507f1f77bcf86cd799439011';

            const response  = await requester
                .get(`/api/adoptions/${fakeAdoptionId}`);

            expect(response.status).to.equal(404);
            expect(response.body).to.have.property('status').that.equals('error');
            expect(response.body.error).to.have.property('code').that.equals('ADOPTION_NOT_FOUND')
        });

        it('Debe fallar con Id invalido', async () => {

            const invalidId = 'invalid-adoption-id';

            const response = await requester
                .get(`/api/adoptions/${invalidId}`);

            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('status').that.equals('error');
            expect(response.body.error).to.have.property('code').that.equals('INVALID_ID');
        });
    });

    describe('Validacion de integridad', () => {

        it('La adopcion debe actualizar el estado de la mascota a adopted:true', async () =>{

            const petResponse = await requester
                .post('/api/pets')
                .send({
                    name: 'Mascota para prueba de integridad',
                    specie: 'Bird',
                    birthDate: '2022-01-01'
                });

            const petId = petResponse.body.payload._id;
            
            const userResponse = await requester
                .post('/api/sessions/register')
                .send({
                    first_name: 'Integridad',
                    last_name: 'Test',
                    email: `integrity.test.${Date.now()}@ejemplo.com`,
                    password: 'contraseña123'
                });

            const userId = userResponse.body.payload;
            
            await requester.post(`/api/adoptions/${userId}/${petId}`);

            const petCheckResponse = await requester.get(`/api/pets/${petId}`);

            expect(petCheckResponse.body.payload).to.have.property('adopted').that.equals(true);
            expect(petCheckResponse.body.payload).to.have.property('owner').that.equals(userId);


            await requester.delete(`/api/users/${userId}`);
            await requester.delete(`/api/pets/${petId}`);
        });

        it('La adopcion debe agregar a la mascota al array de pets del usuario', async () => {

            const petResponse = await requester
                .post('/api/pets')
                .send({
                    name: 'Prueba de agregado de mascotas',
                    specie: 'Hamster',
                    birthDate: '2022-06-01'
                });

            const petId = petResponse.body.payload._id;

            const userResponse = await requester
                .post('/api/sessions/register')
                .send({
                    first_name: 'Array',
                    last_name: 'Test',
                    email: `array.test.${Date.now()}@ejemplo.com`,
                    password: 'contraseña123'
                });

            const userId = userResponse.body.payload;
            
            await requester.post(`/api/adoptions/${userId}/${petId}`);

            const userCheckResponse = await requester.get(`/api/users/${userId}`);

            expect(userCheckResponse.body.payload).to.have.property('pets');
            expect(userCheckResponse.body.payload.pets).to.be.an('array');

            const hasPet = userCheckResponse.body.payload.pets.some(pet => pet._id.toString() === petId);
            
            expect(hasPet).to.be.true;

            await requester.delete(`/api/users/${userId}`);
            await requester.delete(`/api/pets/${petId}`);
        });
    });
});