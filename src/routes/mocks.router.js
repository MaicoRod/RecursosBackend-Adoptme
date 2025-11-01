import { Router } from 'express';
import { generateMockPets } from '../utils/generateMockPets.js';
import { generateMockUsers } from '../utils/mockingUsers.js';
import { usersService, petsService } from '../services/index.js';

const router = Router();


//Endpoint para generar las mascotas mock

router.get('/mockingpets', (req, res, next)=> {
    try {
        const pets= generateMockPets(100);
        res.send({
            status:'success',
            payload: pets
        });
    } catch (error){
        next(error);
    }
});


//Endpoint para generar los usuarios mock

router.get('/mockingusers', async (req, res, next)=> {
    try {
        const users = await generateMockUsers(50);
        res.send({
            status:'success',
            payload: users
        });
    } catch (error){
        next(error);
    }
});

//Endpoint para generacion e insercion de datos a la base

router.post('/generateData', async (req, res, next) => {
    try {

        const {users, pets} = req.body

        if (!users || !pets) {
            return res.status(400).send({
                status: 'error',
                error: 'Los parametros de usuarios y mascotas son requeridos'
            });
        }

        const mockUsers = await generateMockUsers(parseInt(users));
        const insertedUsers = await Promise.all(
            mockUsers.map(user => usersService.create(user))
        );

        const mockPets = generateMockPets(parseInt(pets));
        const insertedPets = await Promise.all(
            mockPets.map(pet => petsService.create(pet))
        );

        res.send({
            status:'success',
            message: 'Datos generados e insertados correctamente',
            payload: {
                usersInserted: insertedUsers.length,
                petsInserted: insertedPets.length
            }
        });
    } catch (error) {
        next(error)
    }
});

export default router;
