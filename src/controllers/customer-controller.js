'use strict';

const validationContract = require('../validators/validator');
const repository = require('../repositories/customer-repository');
const md5 = require('md5');
const authService = require('../services/auth-service');
const emailService = require('../services/email-service');

exports.get = async(req, res, next) => {
    try {
        var data = await repository.get();
        res.status(200).send(data);  
    } catch (e) {
        res.status(500).send({ message: 'Falha ao processar sua requisição.' });
    }    
};

exports.getById = async(req, res, next) => {
    try {
        var data = await repository.getById(req.params.id);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({ message: 'Falha ao processar sua requisição.' });
    }
};

exports.post = async (req, res, next) => {
    let contract = new validationContract();
    contract.hasMinLength(req.body.name, 3, 'O nome deve conter pelo menos 3 caracteres.');
    contract.isEmail(req.body.email, 'E-mail inválido.');
    contract.hasMinLength(req.body.password, 6, 'A senha deve conter pelo menos 6 caracteres.');

    if (!contract.isValid()){
        res.status(400).send(contract.errors()).end();
        return;
    }

    try {
        await repository.create({
            name: req.body.name,
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY),
            roles: ["user"]
        });

        emailService.send(
            req.body.email, 
            'Testando envio de email', 
            global.EMAIL_TMPL.replace('{0}', req.body.name));

        res.status(201).send( { message: 'Cliente cadastrado com suscesso.' } );
    } catch (e) {
        res.status(500).send({message: 'Falha ao cadastrar o Cliente.', data: e});
    }    
};

exports.authenticate = async (req, res, next) => {
    let contract = new validationContract();
    contract.isEmail(req.body.email, 'E-mail inválido.');
    contract.hasMinLength(req.body.password, 6, 'A senha deve conter pelo menos 6 caracteres.');

    if (!contract.isValid()){
        res.status(400).send(contract.errors()).end();
        return;
    }

    try {
        const customer = await repository.authenticate({
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY)
        });

        if(!customer){
            res.status(404).send({ message: 'Cliente não encontrado.' });
            return;
        }

        const token = await authService.generateToken({
            id: customer.id,
            email: customer.email, 
            name: customer.name,
            roles: customer.roles
        });

        res.status(201).send({ 
            token: token,
            data: {
                email: customer.email,
                name: customer.name,
                roles: customer.roles
            } 
        });
    } catch (e) {
        res.status(500).send({message: 'Falha ao autenticar o Cliente.', data: e});
    }    
};

exports.refreshToken = async (req, res, next) => {
    // Recupera o token
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    const data = await authService.decodeToken(token);
    
    try {
        const customer = await repository.getById(data.id);

        if(!customer){
            res.status(401).send({ message: 'Cliente não encontrado.' });
            return;
        }

        const tokenData = await authService.generateToken({
            id: customer.id,
            email: customer.email, 
            name: customer.name,
            roles: customer.roles 
        });

        res.status(201).send({ 
            token: tokenData,
            data: {
                email: customer.email,
                name: customer.name,
                roles: customer.roles
            } 
        });
    } catch (e) {
        res.status(500).send({message: 'Falha ao autenticar o Cliente.', data: e});
    }    
};

exports.put = async (req, res, next) => {
    
    try {
        await repository.update(
            req.params.id, 
            {
                name: req.body.name,
                email: req.body.email,
                password: md5(req.body.password + global.SALT_KEY),
                roles: ["user"]
            });

            emailService.send(
                req.body.email, 
                'Testando envio de email', 
                global.EMAIL_TMPL.replace('{0}', req.body.name));

        res.status(200).send({ message: 'Cliente atualizado com sucesso.' });
    } catch (e) {
        res.status(500).send({ 
            message: 'Falha ao atualizar o cliente.', data: e 
        });
    }
};

exports.delete = async (req, res, next) => {
    try {
        await repository.delete(req.body.id);
        res.status(200).send({ message: 'Cliente removido com sucesso.' });
    } catch (e) {
        res.status(400).send({ message: 'Falha ao remover o cliente.', data: e });
    }
};