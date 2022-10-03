import {Router} from 'express';
import { getCategorias, createCategorias} from '../controllers/categoriasController.js';
import {validaCategoria} from '../middlewares/categoriaMiddlewares.js';

const categoriasRouter = Router();

categoriasRouter.get("/categories", getCategorias);
categoriasRouter.post("/categories", validaCategoria, createCategorias);

export default categoriasRouter;