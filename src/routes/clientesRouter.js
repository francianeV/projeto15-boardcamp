import {Router} from 'express';
import { getClientes, getCliente, createClient, atualizaCliente } from '../controllers/clientesController.js';
import {validaClientes} from '../middlewares/clientesMiddlewares.js';

const clienteRouter = Router();

clienteRouter.get("/customers", getClientes);
clienteRouter.get("/customers/:id", getCliente);
clienteRouter.post("/customers", validaClientes, createClient);
clienteRouter.put("/customers/:id", validaClientes, atualizaCliente)

export default clienteRouter;