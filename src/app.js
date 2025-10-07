import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';

import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';

const app = express();
const PORT = process.env.PORT||8080;
mongoose.connect(`URL de MONGODB`)

.then(()=> { console.log('Base de datos conectada correctamente')})
.catch((error)=> {console.error('Error al conectar a la base de datos', error.message);
    process.exit(1);
});



app.use(express.json());
app.use(cookieParser());

app.use('/api/users',usersRouter);
app.use('/api/pets',petsRouter);
app.use('/api/adoptions',adoptionsRouter);
app.use('/api/sessions',sessionsRouter);


app.use(notFoundHandler);

app.use(errorHandler);


app.listen(PORT,()=>console.log(`Listening on ${PORT}`))
