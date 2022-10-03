import {categoriaSchema} from "../schemas/categoriasSchema.js";

export function validaCategoria(req, res, next) {
    const {name} = req.body;
    
    const validation = categoriaSchema.validate({name}, {abortEarly: false});

    if (validation.error) {
      return res.sendStatus(400); 
    }
  
    next();
  }