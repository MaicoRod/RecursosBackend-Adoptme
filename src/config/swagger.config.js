import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import __dirname from '../utils/index.js';


const swaggerOptions = {
    definition: {
        openapi:'3.0.1',
        info: {
            title: 'Api Adoptme - Sistema para adopción de mascotas',
            version:'1.0.0',
            description:'Api para gestionar adopciones de mascotas. Incluye modulo de usuarios, mascotas y adopciones',
            contact:{
                name:'Equipo Adoptme',
                email:'contacto@adoptme.com'
            }
        }
    },
    servers: [{
        url:'http://localhost:8080',
        description:'Servidor de desarrollo'
    },
    {
        url:'https://adoptme-production.com',
        description: 'Servidor de producción'
    }
],

    components:{
        securitySchemes:{
            cookieAuth:{
                type:'apiKey',
                in: 'cookie',
                name: 'coderCookie',
                description: 'Cookie de autenticación JWT'
            }
        }
    },
    apis: [`${__dirname}/../docs/**/*.yaml`]
};

const swaggerSpecs = swaggerJSDoc(swaggerOptions);

export const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerSpecs));
    console.log('La documentación de Swagger está disponible en http://localhost:8080/api-docs')
};

export default swaggerSpecs;

