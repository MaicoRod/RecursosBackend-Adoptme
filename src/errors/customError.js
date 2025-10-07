import { errorMessages } from "./dictionary.js";

export class CustomError extends Error {
    constructor(errorCode, additionalInfo = null) {
        const errorInfo = errorMessages[errorCode];

        if (!errorInfo) {
            super('Error desconocido');
            this.statusCode = 500;
            this.errorCode = 'UNKNOWN_ERROR';
        } else {
            super(errorInfo.message);
            this.statusCode = errorInfo.statusCode;
            this.errorCode = errorCode;
        }

        this.additionalInfo = additionalInfo;
        this.name = 'CustomError';

        Error.captureStackTrace(this, this.constructor);
    }

    toJson() {
        return {
            status: 'error',
            error: {
                code: this.errorCode,
                message: this.message,
                ...(this.additionalInfo && { details: this.additionalInfo })
            }
        };
    }
}


export const ErrorFactory = {
    createError(errorCode, additionalInfo = null) {
        return new CustomError(errorCode, additionalInfo);
    }
};