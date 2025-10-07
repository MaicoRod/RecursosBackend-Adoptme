import { CustomError } from "../errors/customError.js";
import { errorCodes } from "../errors/dictionary.js";

export const errorHandler = (err, req, res, next) => {

    if (err instanceof CustomError) {
        return res.status(err.statusCode).json(err.toJson());
    }

    if (err.name === 'ValidationError') {
        return res.status(400).json({
            status: 'error',
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Falla en la validacion',
                details: Object.values(err.errors).map(e => e.message)
            }
        });
    }

    if (err.name === 'CastError') {
        return res.status(400).json({
            status: 'error',
            error: {
                code: 'INVALID_ID',
                message: 'ID invalido'
            }
        });
    }

    if (err.code === 11000) {
        return res.status(400).json({
            status: 'error',
            error: {
                code: 'DUPLICATE_KEY',
                message: 'Key duplicado',
                details: Object.keys(err.keyPattern)
            }
        });
    }

    console.error('Unhandled error:', err);
    return res.status(500).json({
        status: 'error',
        error: {
            code: errorCodes.INTERNAL_SERVER_ERROR,
            message: 'Error interno del servidor',
            ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
        }
    });

};

export const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        status: 'error',
        error: {
            code: 'ROUTE_NOT_FOUND',
            message: `Ruta ${req.method} ${req.path} no encontrada`
        }
    });
}