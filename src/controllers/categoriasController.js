import connection from '../db/database.js';
import {categoriaSchema} from '../schemas/categoriasSchema.js';

async function getCategorias(req, res){
    try{
        const categorias = await connection.query('SELECT * FROM categories;');

        res.status(200).send(categorias.rows);

    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
}

async function createCategorias(req, res){
    const {name} = req.body;

    const entradaValida = categoriaSchema.validate({name}, {abortEarly: false});

    if(entradaValida.error){
        return res.sendStatus(400)
    }

    try{
        const categoriaExistente = await connection.query('SELECT * FROM categories WHERE name = $1',[name]);
        
        if(categoriaExistente.rowCount > 0){
            return res.sendStatus(409);
        }
        
        await connection.query('INSERT INTO "categories" (name) VALUES ($1)',[name]);

        res.sendStatus(201);

    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
}

export {getCategorias, createCategorias};