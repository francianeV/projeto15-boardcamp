import joi from 'joi';

const aluguelSchema = joi.object({
    customerId: joi.number().required(),
    gameId: joi.number().required(),
    daysRented: joi.number().required().greater(0)
})

export {aluguelSchema};