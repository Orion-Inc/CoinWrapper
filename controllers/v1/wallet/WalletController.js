require("module-alias/register");
const express = require("express");
const Axios = require('@vendors/Axios');
const Resolvers = require("@utils/resolvers");
const _ = require("lodash");

let walletController;
walletController = {
    all: function(req,res) {
        // Getting all wallet here
        if (_.isString(req.body.wallet_type)) {
            const wallet_type = req.body.wallet_type;
            Axios.get('/v1/btc/main/wallets?token='+process.env.ORION_TOKEN)
                .then( (response) => {
                    res.status(200)
                        .json({
                            message: 'All tokens created by User',
                            success: true,
                            results: response.data
                        });
                }).catch((err, response) => {
                    res.status(500)
                        .json({
                            message: 'An error occurred while getting all wallets',
                            success: false,
                            results: err
                        })
            }).catch( (error) => {
               res.status(500)
                   .json({
                       message: 'A Fatal error occurred',
                       success: false,
                       results: error
                   });
            });
        }
    },
    create: function (req,res) {
        //configuration for user inputs will be here --> Creating a normal wallet or an hd wallet
        if (_.isString(req.body.wallet_type) && _.isString(req.body.wallet_category)) {
            // Getting the wallet type
            const wallet_type = req.body.wallet_type;
            // Getting the wallet category
            const wallet_category = req.body.wallet_category;
            if (wallet_category === "normal_wallet") {
                let wallet_details = {
                    name: req.body.name,
                    addresses: ["1JcX75oraJEmzXXHpDjRctw3BX6qDmFM8e"]
                };
                Axios.post('/v1/'+ wallet_type+'/main/wallets?token='+process.env.ORION_TOKEN,JSON.stringify(wallet_details))
                    .then( (response) => {
                        // saving the status the status to the database to limit the user from creating more than one wallets
                        res.status(201)
                            .json({
                                message: 'Wallet has successfully been created',
                                success: true,
                                results: response.data
                            })
                    })
                    .catch((err,response) =>{
                        res.status(500)
                            .json({
                                message: 'An error occurred while creating user wallet',

                            })
                    })
                    .catch((error) => {

                    });
            } else if (wallet_category === "hd_wallet") {
                // creating an hd wallet
                let wallet_details = {
                    name: req.body.name,
                    extended_public_key: "xpub661MyMwAqRbcFtXgS5sYJABqqG9YLmC4Q1Rdap9gSE8NqtwybGhePY2gZ29ESFjqJoCu1Rupje8YtGqsefD265TMg7usUDFdp6W1EGMcet8"
                };
                Axios.post('/v1/' + wallet_type +'/main/wallets/hd?token='+process.env.ORION_TOKEN, JSON.stringify(wallet_details))
                    .then( (response) => {
                        res.status(201)
                            .json({
                                message: 'HD Wallet Successfully Created',
                                success: true,
                                results: response.data
                            })
                        console.log(response);
                    })
                    .catch( (err, response) => {
                        res.status(409)
                            .json({
                                message: 'Wallet with the same name already exists',
                                success: false,
                                results: err
                            });
                    })
                    .catch( (error) => {
                        res.status(500)
                            .json({
                                message: 'Wallet with the same name already exists',
                                success: false,
                                results: error
                            })
                    });
            }

        }
    },
    details: function(req, res) {

    }
};

module.exports = walletController;