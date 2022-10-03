import {Router} from 'express';
import { createAluguel, getAlugueis, finalzarAluguel, deletaAluguel } from '../controllers/aluguelController.js';
import { validaAluguel } from '../middlewares/alugueisMiddlewares.js';

const aluguelRouter = Router();

aluguelRouter.post("/rentals", validaAluguel, createAluguel);
aluguelRouter.get("/rentals", getAlugueis);
aluguelRouter.post("/rentals/:id/return", finalzarAluguel);
aluguelRouter.delete("/rentals/:id", deletaAluguel);

export default aluguelRouter;