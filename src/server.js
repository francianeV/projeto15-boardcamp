import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import categoriasRouter from './routes/categoriasRoutes.js';
import gamesRouter from './routes/jogosRouters.js';

dotenv.config();

const server = express();
server.use(cors());
server.use(express.json());

server.use(categoriasRouter);
server.use(gamesRouter);

server.listen(process.env.PORT, ()=>console.log(`server listening on port ${process.env.PORT}`));