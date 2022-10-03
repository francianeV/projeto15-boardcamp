import { clienteSchema } from "../schemas/clientesSchema.js";

export function validaClientes(req, res, next) {
    const {name, phone, cpf, birthday} = req.body;
    
    const validation = clienteSchema.validate({name, phone, cpf, birthday}, {abortEarly: false});

    if (validation.error) {
      return res.sendStatus(400); 
    }
  
    next();
  }