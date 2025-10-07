export const errorCodes = {

    //Usuarios
    USER_INCOMPLETE_VALUES:'USER_INCOMPLETE_VALUES',
    USER_ALREADY_EXISTS:'USER_ALREADY_EXISTS',
    USER_NOT_FOUND:'USER_NOT_FOUND',
    USER_INVALID_PASSWORD:'USER_INVALID_PASSWORD',
    USER_INVALID_EMAIL:'USER_INVALID_EMAIL',

    //Mascotas
    PET_INCOMPLETE_VALUES:'PET_INCOMPLETE_VALUES',
    PET_NOT_FOUND:'PET_NOT_FOUND',
    PET_ALREADY_ADOPTED:'PET_ALREADY_ADOPTED',
    PET_INVALID_SPECIE:'PET_INVALID_SPECIE',

    //Adopcion
    ADOPTION_NOT_FOUND:'ADOPTION_NOT_FOUND',
    ADOPTION_INVALID_PARAMS:'ADOPTION_INVALID_PARAMS',

    //Autenticacion
    AUTH_INVALID_TOKEN:'AUTH_INVALID_TOKEN',
    AUTH_MISSING_TOKEN:'AUTH_MISSING_TOKEN',
    AUTH_INVALID_CREDENTIALS:'AUTH_INVALID_CREDENTIALS',

    //Base de datos
    DATABASE_ERROR:'DATABASE_ERROR',

    //Generales
    INVALID_PARAMS:'INVALID_PARAMS',
    INTERNAL_SERVER_ERROR:'INTERNAL_SERVER_ERROR'

};


export const errorMessages = {

    //Usuarios
    [errorCodes.USER_INCOMPLETE_VALUES] : {
        message:'Datos incompletos para el registro de usuario, intenta nuevamente.',
        statusCode: 400
    },
    [errorCodes.USER_ALREADY_EXISTS] : {
        message:'Usuario ya existente, intenta nuevamente.',
        statusCode: 400
    },
    [errorCodes.USER_NOT_FOUND] : {
        message:'Usuario no encontrado.',
        statusCode: 404
    },
    [errorCodes.USER_INVALID_PASSWORD] : {
        message:'La contraseña ingresada no es valida.',
        statusCode: 401
    },
    [errorCodes.USER_INVALID_EMAIL] : {
        message:'El email ingresado no es valido.',
        statusCode: 400
    },

    //Mascotas
    [errorCodes.PET_INCOMPLETE_VALUES] : {
        message:'Debes completar todos los datos de la mascota, intenta nuevamente.',
        statusCode: 400
    },
    [errorCodes.PET_NOT_FOUND] : {
        message:'Mascota no encontrada.',
        statusCode: 404
    },
    [errorCodes.PET_ALREADY_ADOPTED] : {
        message:'Esta mascota ya fue adoptada.',
        statusCode: 400
    },
    [errorCodes.PET_INVALID_SPECIE] : {
        message:'La especie ingresada no es valida.',
        statusCode: 400
    },

    //Adopcion
    [errorCodes.ADOPTION_NOT_FOUND] : {
        message:'Solicitud de adopcion no encontrada',
        statusCode: 404
    },
    [errorCodes.ADOPTION_INVALID_PARAMS] : {
        message:'Parámetros invalidos para la adopción.',
        statusCode: 400
    },

    //Autenticacion
    [errorCodes.AUTH_INVALID_TOKEN] : {
        message:'El token de autenticacion no es valido, intenta nuevamente.',
        statusCode: 401
    },
    [errorCodes.AUTH_MISSING_TOKEN] : {
        message:'Falta el token de autenticacion.',
        statusCode: 401
    },
    [errorCodes.AUTH_INVALID_CREDENTIALS] : {
        message:'Credenciales invalidas, intenta nuevamente.',
        statusCode: 401
    },

    //Base de datos
    [errorCodes.DATABASE_ERROR] : {
        message:'Error interno en la base de datos.',
        statusCode: 500
    },

    //Generales
    [errorCodes.INVALID_PARAMS] : {
        message:'Los parametros proporcionados son invalidos.',
        statusCode: 400
    },
    [errorCodes.INTERNAL_SERVER_ERROR] : {
        message:'Error interno del servidor',
        statusCode: 500
    }

};