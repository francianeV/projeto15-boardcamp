import joi from 'joi';

const categoriaSchema = joi.object({
    name: joi.string().min(2).required()
});

export {categoriaSchema};