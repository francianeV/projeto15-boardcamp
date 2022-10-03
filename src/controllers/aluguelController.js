import connection from "../db/database.js";
import {aluguelSchema} from "../schemas/aluguelSchema.js";

async function createAluguel(req, res) {
    const {customerId, gameId, daysRented} = req.body;

    const validaAluguel = aluguelSchema.validate({customerId, gameId, daysRented},{abortEarly: false});

    if(validaAluguel.error){
        return res.status(400).send(validaAluguel.error.message);
    }

    try {
      const clienteExistente = await connection.query(`SELECT id FROM customers WHERE id = $1`,[customerId]);

      if (clienteExistente.rowCount === 0) {
        return res.sendStatus(400); 
      }
  
      const jogoExistente = await connection.query(`SELECT * FROM games WHERE id=$1`,[gameId]);

      if (jogoExistente.rowCount === 0) {
        return res.sendStatus(400);
      }
      const jogo = jogoExistente.rows[0];
  
      const jogoDisponivel = await connection.query(`SELECT id FROM rentals WHERE "gameId" = $1 AND "returnDate" IS null`, [gameId]);
  
      if (jogoDisponivel.rowCount > 0) {
        if (jogo.stockTotal === jogoDisponivel.rowCount) {
          return res.sendStatus(400); 
        }
      }
  
      const originalPrice = daysRented * jogo.pricePerDay;

      await connection.query(
        `
        INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
        VALUES ($1, $2, NOW(), $3, null, $4, null); 
        `,
        [customerId, gameId, daysRented, originalPrice]
      );
  
      res.sendStatus(201); 

    } catch (error) {
      console.log(error);
      res.sendStatus(500); 
    }
}

async function getAlugueis(req, res){
    const {customerId, gameId} = req.query;
    
    try{
        let buscarClienteEspecifico = '';
        let buscarJogoEspecifico = '';
        let buscar = '';

        if(customerId){
            buscarClienteEspecifico += `WHERE "customerId" = ${customerId};`;
        }

        if(gameId){
            buscarJogoEspecifico += `WHERE "gameId" = ${gameId};`;
        }

        const result = await connection.query(
            {
            text: `
            SELECT 
                rentals.*,
                customers.name AS customer,
                games.name as game,
                categories.*
            FROM rentals
                JOIN customers ON customers.id=rentals."customerId"
                JOIN games ON games.id=rentals."gameId"
                JOIN categories ON categories.id=games."categoryId" ${buscarClienteEspecifico} ${buscarJogoEspecifico};
            `,
            rowMode: 'array'
            },
        );

        res.send(result.rows.map(_mapRentalsArrayToObject));

    }catch(err){
        console.log(err)
        res.sendStatus(500);
    }
}

async function finalzarAluguel(req, res) {
    const {id} =  req.params;

    try{
        const aluguelExistente = await connection.query('SELECT * FROM rentals WHERE id = $1',[id]);

        if(aluguelExistente.rowCount === 0){
            return res.sendStatus(404);
        }

        const aluguel = aluguelExistente.rows[0];

        if(aluguel.returnDate !== null){
            return res.sendStatus(400);
        }

        const pegaDiasAtraso = new Date().getTime() - new Date(aluguel.rentDate).getTime(); 
        
        const calculaAtraso = Math.floor(pegaDiasAtraso / (24 * 3600 * 1000));

        let delayFee = 0;

        if(calculaAtraso > aluguel.daysRented){
            const diasAdicionais = calculaAtraso - aluguel.daysRented;
            delayFee = diasAdicionais * aluguel.originalPrice;
        }

        await connection.query(`
            UPDATE rentals SET "returnDate" = NOW(), "delayFee" = $1 WHERE id = $2;
        `,[delayFee, id]
        );

        res.sendStatus(200);

    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
}

async function deletaAluguel(req, res) {
    const {id} = req.params;

    try{
        const aluguelExiste = await connection.query('SELECT * FROM rentals WHERE id = $1',[id]);

        if(aluguelExiste.rowCount === 0){
            return res.sendStatus(404);
        }

        const aluguel = aluguelExiste.rows[0];

        if(aluguel.returnDate === null){
            return res.sendStatus(400);
        }

        await connection.query('DELETE FROM rentals WHERE id = $1',[id]);

        res.sendStatus(200);
        
    }catch(err){
        res.sendStatus(500);
    }
}

function _mapRentalsArrayToObject(row) {
    const [
      id,
      customerId,
      gameId,
      rentDate,
      daysRented,
      returnDate,
      originalPrice,
      delayFee,
      customerName,
      gameName,
      categoryId,
      categoryName
    ] = row;
  
    return {
      id,
      customerId,
      gameId,
      rentDate,
      daysRented,
      returnDate,
      originalPrice,
      delayFee,
      customer: {
        id: customerId,
        name: customerName
      },
      game: {
        id: gameId,
        name: gameName,
        categoryId,
        categoryName
      }
    };
  }

export {createAluguel, getAlugueis, finalzarAluguel, deletaAluguel};