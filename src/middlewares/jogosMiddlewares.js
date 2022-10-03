import {gamesSchema} from "../schemas/jogosSchema.js";

export function validaJogo(req, res, next) {
    const {name, image, stockTotal, categoryId, pricePerDay} = req.body;
    
    const validation = gamesSchema.validate({name, image, stockTotal, categoryId, pricePerDay}, {abortEarly: false});

    if (validation.error) {
      return res.sendStatus(400); 
    }
  
    next();
  }