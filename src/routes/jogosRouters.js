import {Router} from 'express';
import { getGames, createGame } from '../controllers/jogosController.js';

const gamesRouter = Router();

gamesRouter.get("/games", getGames);
gamesRouter.post("/games", createGame);

export default gamesRouter;