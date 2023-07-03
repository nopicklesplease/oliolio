const express = require('express');
const app = express.Router();
const { Entry } = require('../db');

app.get('/', async (req, res, next) => {
    try{
        res.send(await Entry.findAll({
            order: [['createdAt', 'desc']]
          }))
    }
    catch(err){
        next(err);
    }
})

app.post('/', async (req, res, next) => {
    try{
        res.status(201).send(await Entry.create(req.body));
    }
    catch(err){
        next(err);
    }
})

app.put('/:id', async(req, res, next) => {
    try{
      const entry = await Entry.findByPk(req.params.id);
      res.send(await entry.update(req.body));
    }
    catch(err){
      next(err);
    }
  })

app.delete('/:id', async (req, res, next) => {
    try{
        const entry = await Entry.findByPk(req.params.id);
        await entry.destroy();
        res.sendStatus(204);
    }
    catch(err){
        next(err);
    }
})

module.exports = app;