require("module-alias/register");
const express = require("express");
const Axios = require('@vendors/Axios');
const Resolvers = require("@utils/resolvers");
const _ = require("lodash");

// importing the services here
const WalletServices = require("@services/WalletServices");
// importing the models here
const WalletStatus = require("@models/wallet/wallet_status");

let walletController;
walletController = {
    all: async function(req,res) {
        // Getting all wallet here associated with a particular user
        const coin_type = req.body.coin_type ? req.body.coin_type : 'btc';
        const user_email = req.decoded.email;

        try {
            const allWalletsData = await WalletServices.getAllWalletByUser(coin_type,process.env.ORION_TOKEN);
            if (allWalletsData) {
                const all_wallets = allWalletsData.data.wallet_names;
                WalletStatus.find({ user_email })
                .exec( function(err, results) {
                    if(!err && results) {
                       const itemToData =  _.forEach(results, function(item) {
                            return all_wallets.includes(item.wallet_identifier) && user_email === item.user_email;
                        });
                        res.status(200)
                            .json({
                                message: 'All Wallets associated with this user',
                                success: true,
                                results: itemToData
                            });
                    } else {
                        res.status(500)
                            .json({
                                message: 'An Error occurred while getting the wallets',
                                success: false,
                                results: err
                            });
                    }
                });
            
            }
        } catch (e) {
            res.status(500)
                .json({
                    message: "An error occurred while getting the wallets",
                    success: false,
                    results: e
                });

        }

    },
    generateAddress: async function(req, res) {
        try{
            console.log(req.query.coin_type);
            const coin_type = req.query.coin_type ? req.query.coin_type : 'btc';
            const address = await WalletServices.generateAddress(coin_type);
            if(address && address.status === 201) {
                res.status(201)
                    .json({
                        message: 'Generated Address',
                        success: true,
                        results: address.data
                    });
            }
        } catch(e){
            res.status(500)
                .json({
                    message: 'An error occurred',
                    success: false,
                    results: e
                })
        }
    },
    addAddressToWallet: async function(req, res) {
        const wallet_name = req.params.wallet_name;
        const coin_type = req.body.coin_type || req.query.coin_type ;
        const addresses = req.body.addresses;
        console.log(addresses);
        if(!_.isArray(addresses)) {
            try{
                const data = {
                    "addresses": [addresses]
                };
    
                const addResults = await WalletServices.addAddressToWallet(coin_type ? coin_type : 'btc',wallet_name,process.env.ORION_TOKEN,data);
                console.log(addResults);
            } catch(e){
                console.log(e);
            }
        } else {
            res.status(500)
                .json({
                    message: 'Address must be an array',
                    success: false
                });
        }
    },
    getNormalWallet: async function(req, res) {
        const coin_type = req.body.coin_type ? req.body.coin_type : 'btc';
        const wallet_name = req.body.wallet_name;
        try {
            const getNormal_wallet = await WalletServices.getNormalWalletByName(coin_type,wallet_name,process.env.ORION_TOKEN);
            if(getNormal_wallet) {

            }
        } catch (e) {
            res.status(500)
                .json({
                    message: "An Error occurred while getting wallets",
                    success: false,
                    results: e
                });
        }
    },
    getHDWallet: async function(req, res) {
        const coin_type = req.body.coin_type ? req.body.coin_type : 'btc';
        const wallet_name = req.body.wallet_name;
        try {
            const getHD_wallet = await WalletServices.getHDWalletByName(coin_type,wallet_name, process.env.ORION_TOKEN);
            if (getHD_wallet) {

            }
        } catch (e) {
            res.status(500)
                .json({
                    message: "An Error occurred while getting hd wallets",
                    success: false,
                    results: e
                });
        }
    },
    create: async function (req,res) {
        //configuration for user inputs will be here --> Creating a normal wallet or an hd wallet
        if (_.isString(req.body.coin_type) && _.isString(req.body.wallet_category)) {
            // Getting the wallet type
            const wallet_type = req.body.coin_type ? req.body.coin_type : 'btc';
            // Getting the wallet category
            const wallet_category = req.body.wallet_category ? req.body.wallet_category : 'hd_wallet';
            const wallet_name = req.body.wallet_name;
            // get the user credentials from the verified token and use it in getting a particular created wallet
            const user_email = req.decoded.email;
            const user_id = req.decoded.user_id;

            // switching the wallet categories to work on the what should be created
            switch(wallet_category) {
                case "normal_wallet":
                        try {
                            const wallet_details = {
                                name: wallet_name,
                                addresses: ["1JcX75oraJEmzXXHpDjRctw3BX6qDmFM8e"]
                            };
                            const createdWallet = await WalletServices.createNormalWallet(wallet_type,process.env.ORION_TOKEN,wallet_details);
                            if(createdWallet && createdWallet.status === 201) {
                                // once the data is available , save it to the wallet status schema
                                const created_wallet_name = createdWallet.data.name;
                                const status_data = {
                                    wallet_identifier: createdWallet.data.name,
                                    status: true,
                                    user_email: user_email,
                                    user_id: user_id
                                };
                                const Query = new WalletStatus(status_data);
                                WalletStatus.findOne({ wallet_identifier: created_wallet_name })
                                .where("user_email",user_email)
                                .exec( function(err, results) {
                                    if(!results && !err) {
                                        Query.save( function(err, wallet_status) {
                                            if(!err && wallet_status) {
                                                res.status(201)
                                                .json({
                                                    message: 'Wallet Successfully Created',
                                                    success: true,
                                                    results: {
                                                        wallet_status
                                                    }
                                                });
                                            }
                                        });
                                    } else {
                                        res.status(500)
                                        .json({
                                            message: 'Wallet Identifier already exists',
                                            success: false,
                                            results: err
                                        });
                                    }
                                });
                            }
                        } catch(e) {
                            res.status(500)
                            .json({
                                message: e.response.data.error,
                                success: false,
                                results: null
                            });
                        }
                        break;
                case "hd_wallet":
                        try {
                            const wallet_details = {
                                name: wallet_name,
                                extended_public_key: "xpub661MyMwAqRbcFtXgS5sYJABqqG9YLmC4Q1Rdap9gSE8NqtwybGhePY2gZ29ESFjqJoCu1Rupje8YtGqsefD265TMg7usUDFdp6W1EGMcet8"
                            };
                            const createdWallet = await WalletServices.createHDWallet(wallet_type,process.env.ORION_TOKEN,wallet_details);
                            if(createdWallet && createdWallet.status === 201) {
                                // once the data is available , save it to the wallet status schema
                                const created_wallet_name = createdWallet.data.name;
                                const status_data = {
                                    wallet_identifier: createdWallet.data.name,
                                    status: true,
                                    user_email: user_email,
                                    user_id: user_id
                                };
                                const Query = new WalletStatus(status_data);
                                WalletStatus.findOne({ wallet_identifier: created_wallet_name })
                                .where("user_email", user_email)
                                .exec( function(err, results) {
                                    if(!err && !results) {
                                        Query.save( function(err, wallet_status) {
                                            if(!err && wallet_status) {
                                                res.status(201)
                                                .json({
                                                    message: 'Wallet Successfully Created',
                                                    success: true,
                                                    results: {
                                                        wallet_status
                                                    }
                                                });
                                            }
                                        });
                                    } else {
                                        res.status(500)
                                        .json({
                                            message: 'Wallet Identifier already exists',
                                            success: false,
                                            results: err
                                        });
                                    }
                                });
                            }
                        } catch(e) {
                            res.status(500)
                            .json({
                                message: e.response.data.error,
                                success: false,
                                results: null
                            });
                        }
                        break;
                default: 
                        res.status(500)
                            .json({
                                message: 'Invalid Wallet Category',
                                success: false,
                                results: null
                            });
                        break;
            }
            
        }
    },
    details: async function(req, res) {
        // Getting all wallet here associated with a particular user
        const coin_type = req.body.coin_type ? req.body.coin_type : 'btc';
        const user_email = req.decoded.email;
        const wallet_name = req.params.wallet_name;
        console.log(coin_type);
        console.log(wallet_name);
        console.log(process.env.ORION_TOKEN);
        try {
            const singleWalletData = await WalletServices.getHDWalletByName(coin_type,wallet_name, process.env.ORION_TOKEN);
            if(singleWalletData.status === 200) {
                res.status(singleWalletData.status)
                    .json({
                        message: `Public Address associated with ${wallet_name}`,
                        success: true,
                        results: singleWalletData.data.chains
                    })
            }
            
        } catch (e) {
            res.status(500)
                .json({
                    message: "An error occurred while getting the wallets",
                    success: false,
                    results: e
                });

        }
    },
    delete: async function(req, res) {
        /*
        * accepts (coin_type, wallet_category, token, name)
        * return null
        */
        // this is the endpoint for deleting or removing a wallet from the blockcypher endpoint
        const coin_type = req.body.coin_type;
        const wallet_category = req.body.wallet_category;
        const wallet_name = req.body.wallet_name;
        const user_email = req.decoded.email;
        switch (wallet_category) {
            case "normal_wallet":
                 try {
                     const delete_status = await WalletServices.deleteNormalWallet(coin_type,process.env.ORION_TOKEN, wallet_name);
                     if(delete_status.status === 204) {
                         WalletStatus.findOne({ wallet_identifier: wallet_name })
                            .where("user_email", user_email)
                            .exec( function(err, results) {
                                if(!err && results) {
                                    WalletStatus.findOneAndDelete({ wallet_identifier: wallet_name })
                                        .where("user_email", user_email)
                                        .exec( function(err, results){
                                            if(!err && results) {
                                                res.status(200)
                                                    .json({
                                                        message: "Wallet Successsfully Deleted",
                                                        success: true
                                                    });
                                            } else {
                                                res.status(500)
                                                    .json({
                                                        message: "An error occurred while deleting wallet details",
                                                        success: false,
                                                        results: err
                                                    });
                                            }
                                        });
                                } else {
                                    res.status(500)
                                        .json({
                                            message: "Wallet details doesn\'t exists",
                                            success: false,
                                            results: err
                                        });
                                }
                            });
                     }
                 } catch(e) {
                     res.status(500)
                        .json({
                            message: 'An error occurred while deleting wallet',
                            success: false,
                            results: e
                        });
                 }
                 break;
            case "hd_wallet":
                    try {
                        const delete_status = await WalletServices.deleteHDWallet(coin_type,process.env.ORION_TOKEN, wallet_name);
                        if(delete_status.status === 204) {
                            WalletStatus.findOne({ wallet_identifier: wallet_name })
                            .where("user_email", user_email)
                            .exec( function(err, results) {
                                if(!err && results) {
                                    WalletStatus.findOneAndDelete({ wallet_identifier: wallet_name })
                                        .where("user_email", user_email)
                                        .exec( function(err, results){
                                            if(!err && results) {
                                                res.status(200)
                                                    .json({
                                                        message: "Wallet Successsfully Deleted",
                                                        success: true
                                                    });
                                            } else {
                                                res.status(500)
                                                    .json({
                                                        message: "An error occurred while deleting wallet details",
                                                        success: false,
                                                        results: err
                                                    });
                                            }
                                        });
                                } else {
                                    res.status(500)
                                        .json({
                                            message: "Wallet details doesn\'t exists",
                                            success: false,
                                            results: err
                                        });
                                }
                            });
                        }
                    } catch(e) {
                        res.status(500)
                            .json({
                                message: 'An erroro occurred while deleting wallet',
                                success: false, 
                                results: e
                            })
                    }
                 break;
            default: 
                res.status(500)
                    .json({
                        message: "Invalid wallet category",
                        success: false
                    });
                 break;
        }

    },
    initTransaction: async function(req, res) {
        try{
            const inputAddress = {
                addresses: req.body.input_addresses,   
            };
            const outputAddress = {
                addresses: req.body.output_addresses,
                value: req.body.amount,
            }; 

            if(_.isArray(inputAddress.addresses) && _.isArray(outputAddress.addresses)) {
                if(!_.isEmpty(outputAddress.value)) {
                    var newtx = {
                        inputs: [ inputAddress ],
                        outputs: [ outputAddress ]
                      };
                    const transact = await WalletServices.createTransaction(newtx);
                    if(transact) {
                        res.status(200)
                            .json({
                                message: 'Transaction has been initiated',
                                success: true,
                                results: transact.data
                            });
                    }
                } else {
                    res.status(500)
                        .json({
                            message: 'Transaction Amount Cannot Be empty',
                            success: false
                        });
                }
            } else {
                res.status(500)
                    .json({
                        message: 'Request Body Must be an array',
                        success: false
                    });
            }
            
        } catch(e){
            res.status(500)
                .json({
                    message: 'An error occurrred ',
                    success: false,
                    results: e.response.data
                });
        }
    }
};

module.exports = walletController;