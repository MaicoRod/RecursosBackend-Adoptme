import { usersService } from "../services/index.js";
import { createHash, passwordValidation } from "../utils/index.js";
import jwt from 'jsonwebtoken';
import UserDTO from '../dto/User.dto.js';
import { CustomError } from "../errors/customError.js";
import { errorCodes } from "../errors/dictionary.js";

const register = async (req, res, next) => {
    try {
        const { first_name, last_name, email, password } = req.body;

        if (!first_name || !last_name || !email || !password) {
            throw new CustomError(errorCodes.USER_INCOMPLETE_VALUES);
        }

        const exists = await usersService.getUserByEmail(email);

        if (exists) {
            throw new CustomError(errorCodes.USER_ALREADY_EXISTS, { email });
        }

        const hashedPassword = await createHash(password);
        const user = {
            first_name,
            last_name,
            email,
            password: hashedPassword
        }
        let result = await usersService.create(user);
        res.send({ status: "success", payload: result._id });
    } catch (error) {
        next(error)
    }
}

const login = async (req, res, next) => {
    try {

        const { email, password } = req.body;
        if (!email || !password) {
            throw new CustomError(errorCodes.USER_INCOMPLETE_VALUES);
        }

        const user = await usersService.getUserByEmail(email);

        if (!user) {
            throw new CustomError(errorCodes.USER_NOT_FOUND);
        }

        const isValidPassword = await passwordValidation(user, password);

        if (!isValidPassword) {
            throw new CustomError(errorCodes.USER_INVALID_PASSWORD);
        }

        const userDto = UserDTO.getUserTokenFrom(user);
        const token = jwt.sign(userDto, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || "1h" });
        res.cookie('coderCookie', token, { maxAge: 3600000 }).send({ status: "success", message: "Logged in" })

    } catch (error) {
        next(error)
    }
}

const current = async (req, res, next) => {
    try {
        const cookie = req.cookies['coderCookie'];

        if (!cookie) {
            throw new CustomError(errorCodes.AUTH_MISSING_TOKEN);
        }

        try {
            const user = jwt.verify(cookie, process.env.JWT_SECRET);
            return res.send({ status: "success", payload: user })
        } catch (jwtError) {
            throw new CustomError(errorCodes.AUTH_INVALID_TOKEN);
        }
    } catch (error) {
        next(error)
    }
}

const unprotectedLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new CustomError(errorCodes.USER_INCOMPLETE_VALUES);
        }

        const user = await usersService.getUserByEmail(email);
        if (!user) {
            throw new CustomError(errorCodes.USER_NOT_FOUND);
        }

        const isValidPassword = await passwordValidation(user, password);
        if (!isValidPassword) {
            throw new CustomError(errorCodes.USER_INVALID_PASSWORD);
        }

        const userDto = UserDTO.getUserTokenFrom(user);
        const token = jwt.sign(userDto, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || "1h" });
        res.cookie('unprotectedCookie', token, { maxAge: 3600000 }).send({ status: "success", message: "Unprotected Logged in" })

    } catch (error) {
        next(error);
    }
}
const unprotectedCurrent = async (req, res, next) => {
    try {
        const cookie = req.cookies['unprotectedCookie']

        if (!cookie) {
            throw new CustomError(errorCodes.AUTH_MISSING_TOKEN);
        }

        const user = jwt.verify(cookie, process.env.JWT_SECRET);
        return res.send({ status: "success", payload: user })

    } catch (error) {
        next(error);
    }
}
export default {
    current,
    login,
    register,
    unprotectedLogin,
    unprotectedCurrent
};