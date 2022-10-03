import {Router} from 'express';
import { getClientes, getCliente, createClient, atualizaCliente } from '../controllers/clientesController.js';

const clienteRouter = Router();

clienteRouter.get("/customers", getClientes);
clienteRouter.get("/customers/:id", getCliente);
clienteRouter.post("/customers", createClient);
clienteRouter.put("/customers/:id",atualizaCliente)

export default clienteRouter;