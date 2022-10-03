import { aluguelSchema } from "../schemas/aluguelSchema.js";

export function validaAluguel(req, res, next) {
    const {customerId, gameId, daysRented} = req.body;
    
    const validation = aluguelSchema.validate({customerId, gameId, daysRented}, {abortEarly: false});

    if (validation.error) {
      return res.sendStatus(400); 
    }
  
    next();
  }