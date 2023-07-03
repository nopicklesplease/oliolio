const express = require('express');
const app = express.Router();
const { Wallet } = require('../db');

app.get('/', async (req, res, next) => {
    try{
        res.send(await Wallet.findAll());
    }
    catch(err){
        next(err);
    }
})

app.get('/:id', async (req, res, next) => {
    try{
        res.send(await Wallet.findByPk(req.params.id))
    }
    catch(err){
        next(err);
    }
})

app.put('/:id', async(req, res, next) => {
    try{
      const wallet = await Wallet.findByPk(req.params.id);
      res.send(await wallet.update(req.body));
    }
    catch(err){
      next(err);
    }
  })

app.post('/', async (req, res, next) => {
    try{
        res.status(201).send(await Wallet.create(req.body));
    }
    catch(err){
        next(err);
    }
})

app.delete('/:id', async (req, res, next) => {
    try{
        const wallet = await Wallet.findByPk(req.params.id);
        await wallet.destroy();
        res.sendStatus(204);
    }
    catch(err){
        next(err);
    }
})

module.exports = app;