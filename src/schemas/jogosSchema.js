import joi from 'joi';

const gamesSchema = joi.object({
    name: joi.string().min(2).required(),
    image: joi.string(),
    stockTotal: joi.number().required().greater(0),
    pricePerDay: joi.number().required().greater(0),
    categoryId: joi.number().required()
})

export {gamesSchema};