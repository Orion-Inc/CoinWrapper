"use strict"
const Joi = require("joi");

let WalletPolicy;
WalletPolicy = {
    createWallet: function(req, res, next) {
        const WalletSchema = Joi.object().keys({
            coin_type: Joi.string().min(3).required(),
            wallet_category: Joi.string().min(5).required(),
            wallet_name: Joi.string().min(1).required()
        });

        // validating the inputs here
        const {error, value} = Joi.validate(req.body, WalletSchema);
        if(error) {
            switch(error.details[0].context.key) {
                case 'coin_type':
                    res.status(500)
                        .json({
                            message: error.details[0].message,
                            success: false
                        });
                    break;
                case 'wallet_category':
                    res.status(500)
                        .json({
                            message: error.details[0].message,
                            success: false
                        });
                    break;
                case 'wallet_name':
                    res.status(500)
                        .json({
                            message: error.details[0].message,
                            success: false
                        });
                    break;
                default:
                    res.status(500)
                        .json({
                            message: 'Invalid information provided',
                            success: false
                        });
                    break;
            }
        } else {
            next();
        }
    },
    updateWallet: function(req, res, next) {

    },
    deleteWallet: function(req, res, next) {
        const WalletSchema = Joi.object().keys({
            coin_type: Joi.string().min(3).required(),
            wallet_category: Joi.string().min(5).required(),
            wallet_name: Joi.string().min(1).required()
        });

         // validating the inputs here
         const {error, value} = Joi.validate(req.body, WalletSchema);
         if(error) {
             switch(error.details[0].context.key) {
                 case 'coin_type':
                     res.status(500)
                         .json({
                             message: error.details[0].message,
                             success: false
                         });
                     break;
                 case 'wallet_category':
                     res.status(500)
                         .json({
                             message: error.details[0].message,
                             success: false
                         });
                     break;
                 case 'wallet_name':
                     res.status(500)
                         .json({
                             message: error.details[0].message,
                             success: false
                         });
                     break;
                 default:
                     res.status(500)
                         .json({
                             message: 'Invalid information provided',
                             success: false
                         });
                     break;
             }
    } else {
        next();
    }
}

};

// exporting the policy to be used globally
module.exports = WalletPolicy;