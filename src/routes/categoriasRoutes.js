import {Router} from 'express';
import { getCategorias, createCategorias} from '../controllers/categoriasController.js';

const categoriasRouter = Router();

categoriasRouter.get("/categories", getCategorias);
categoriasRouter.post("/categories", createCategorias);

export default categoriasRouter;