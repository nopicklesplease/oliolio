const express = require('express');
const app = express.Router();
const path = require('path');
const request = require('request');

require('dotenv').config();

module.exports = app;

app.get('/:coin', (req, res, next) => {
    try{
        console.log(process.env.API_KEY)
        const coin = req.params.coin;

        const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${ coin }`;

        request.get({
            url: url,
            json: true,
            headers: {
                'X-CMC_PRO_API_KEY': process.env.API_KEY
            }}, (err, response, data) => {
                if(err){
                    return res.send({
                        error: err
                    });
                }

            res.send({
                price: data.data[coin].quote.USD.price,
                volume_24h: data.data[coin].quote.USD.volume_24h
            })
        });
    }
    catch(err){
        next(err);
    }
})

