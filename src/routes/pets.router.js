import { Router } from 'express';
import petsController from '../controllers/pets.controller.js';
import uploader from '../utils/uploader.js';
import { generateMockPets } from '../utils/generateMockPets.js';

const router = Router();

router.get('/mockingpets', (req, res, next) =>{
    try {
        const pets = generateMockPets(100);
        res.send({
            status:"success",
            payload: pets,
            count: pets.length
        });
    } catch (error) {
        next(error);
    }
});
router.get('/',petsController.getAllPets);
router.post('/',petsController.createPet);
router.post('/withimage',uploader.single('image'), petsController.createPetWithImage);
router.put('/:pid',petsController.updatePet);
router.delete('/:pid',petsController.deletePet);

export default router;