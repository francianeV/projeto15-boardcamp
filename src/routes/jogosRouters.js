import {Router} from 'express';
import { getGames, createGame } from '../controllers/jogosController.js';
import {validaJogo} from '../middlewares/jogosMiddlewares.js';

const gamesRouter = Router();

gamesRouter.get("/games", getGames);
gamesRouter.post("/games", validaJogo, createGame);

export default gamesRouter;