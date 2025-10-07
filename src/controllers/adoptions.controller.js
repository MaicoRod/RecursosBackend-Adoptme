import { adoptionsService, petsService, usersService } from "../services/index.js";
import { CustomError } from "../errors/customError.js";
import { errorCodes } from "../errors/dictionary.js";

const getAllAdoptions = async (req, res, next) => {
    try {
        const result = await adoptionsService.getAll();
        res.send({ status: "success", payload: result });
    } catch (error) {
        next(error);
    }
}

const getAdoption = async (req, res, next) => {
    try {
        const adoptionId = req.params.aid;
        const adoption = await adoptionsService.getBy({ _id: adoptionId })
        if (!adoption) {
            throw new CustomError(errorCodes.ADOPTION_NOT_FOUND);
        }
        res.send({ status: "success", payload: adoption })

    } catch (error) {
        next(error);
    }
}

const createAdoption = async (req, res, next) => {
    try {
        const { uid, pid } = req.params;

        if (!uid || !pid) {
            throw new CustomError(errorCodes.ADOPTION_INVALID_PARAMS);
        }

        const user = await usersService.getUserById(uid);
        if (!user) {
            throw new CustomError(errorCodes.USER_NOT_FOUND);
        }

        const pet = await petsService.getBy({ _id: pid });
        if (!pet) {
            throw new CustomError(errorCodes.PET_NOT_FOUND);
        }

        if (pet.adopted) {
            throw new CustomError(errorCodes.PET_ALREADY_ADOPTED, { petId: pid });
        }

        user.pets.push(pet._id);
        await usersService.update(user._id, { pets: user.pets })
        await petsService.update(pet._id, { adopted: true, owner: user._id })
        await adoptionsService.create({ owner: user._id, pet: pet._id })
        res.send({ status: "success", message: "Pet adopted" });

    } catch (error) {
        next(error);
    }
}

export default {
    createAdoption,
    getAllAdoptions,
    getAdoption
};