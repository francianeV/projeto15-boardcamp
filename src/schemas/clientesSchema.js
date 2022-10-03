import joi from 'joi';

const clienteSchema = joi.object({
    name: joi.string().min(2).required(),
    phone: joi.string().required().min(10).max(11).regex(/^\d+$/),
    birthday: joi.date().required(),
    cpf: joi.string().regex(/^\d+$/).required().length(11)
})

export {clienteSchema};