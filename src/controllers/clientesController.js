import connection from "../db/database.js";
import {clienteSchema} from "../schemas/clientesSchema.js";

async function getClientes(req, res){
    const {cpf} = req.query;

    try{
        let buscarClienteEspecifico = '';

        if(cpf){
            buscarClienteEspecifico += `WHERE cpf LIKE '${cpf}%';`
        }

        const retornaClientes = await connection.query(`
            SELECT * FROM customers ${buscarClienteEspecifico};`)

        res.status(200).send(retornaClientes.rows);

    }catch(err){
        res.sendStatus(500);
    }
}

async function getCliente(req, res){
    const {id} = req.params;

    try{
        const cliente = await connection.query('SELECT * FROM customers WHERE id = $1;',[id]);

        if(cliente.rowCount === 0){
            return res.sendStatus(404);
        }
        
        res.send(cliente.rows[0]);
    }catch(err){
        res.sendStatus(500);
    }
}

async function createClient(req, res){
    const {name, phone, cpf, birthday} = req.body;

    const validaCliente = clienteSchema.validate({name, phone, cpf, birthday},{abortEarly: false});

    if(validaCliente.error){
        return res.status(400).send(validaCliente.error.message);
    }

    try{

        const cpfExistente = await connection.query('SELECT * FROM customers WHERE cpf = $1;',[cpf]);

        if(cpfExistente.rowCount > 0){
            return res.sendStatus(409);
        }

        await connection.query('INSERT INTO "customers" (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);',[name, phone, cpf, birthday]);

        res.sendStatus(201);

    }catch(err){
        res.sendStatus(500);
    }
}

async function atualizaCliente(req, res){
    const {id} = req.params;
    const {name, phone, cpf, birthday} = req.body;

    const validaCliente = clienteSchema.validate({name, phone, cpf, birthday},{abortEarly: false});

    if(validaCliente.error){
        return res.status(400).send(validaCliente.error.message);
    }

    try{
        const cliente = await connection.query('SELECT * FROM customers WHERE id = $1;',[id]);

        if(cliente.rowCount === 0){
            return res.sendStatus(404);
        }

        const cpfExistente = await connection.query('SELECT * FROM customers WHERE cpf = $1 AND id <> $2;',[cpf, id]);

        if(cpfExistente.rowCount > 0){
            return res.sendStatus(409);
        }

        await connection.query(`
            UPDATE customers 
            SET 
                name = $1, 
                phone = $2, 
                cpf = $3, 
                birthday = $4
            WHERE id = $5;`,
            [name, phone, cpf, birthday, id]);

        res.sendStatus(200);

    }catch(err){
        res.sendStatus(500);
    }
}



export {getClientes, getCliente, createClient, atualizaCliente};