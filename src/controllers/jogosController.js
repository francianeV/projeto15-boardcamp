import connection from '../db/database.js';
import {gamesSchema} from '../schemas/jogosSchema.js';

async function getGames(req, res){
    const {name} = req.query;

    try{
        let buscarJogoEspecifico = '';

        if(name){
            buscarJogoEspecifico += `WHERE games.name ILIKE '${name}%';`
        }

        const games = await connection.query(`
            SELECT 
                games.*, 
                categories.name AS "categoryName" 
            FROM games 
            JOIN categories 
                ON games."categoryId" = categories.id ${buscarJogoEspecifico};
        `);

        res.send(games.rows);

    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
}

async function createGame(req, res){
    const {name, image, stockTotal, categoryId, pricePerDay} = req.body;

    const validaEntrada = gamesSchema.validate({name, image, stockTotal, categoryId, pricePerDay}, {abortEarly: false});

    if(validaEntrada.error){
        console.log(validaEntrada.error.message);
        return res.sendStatus(400);
    }

    try{
        const jogoExistente = await connection.query('SELECT * FROM games WHERE name = $1',[name])
        
        if(jogoExistente.rowCount > 0){
            return res.sendStatus(409);
        }

        const idExistente = await connection.query('SELECT * FROM categories WHERE id = $1',[categoryId]);

        if(idExistente.rowCount === 0){
            return res.sendStatus(400);
        }

        await connection.query(`
            INSERT INTO "games" (name, image, "stockTotal", "categoryId", "pricePerDay") 
            VALUES ($1, $2, $3, $4, $5);`,
            [name, image, stockTotal, categoryId, pricePerDay]
        );

        res.sendStatus(201);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
}

export {getGames, createGame};