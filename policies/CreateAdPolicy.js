const Joi = require("joi");
let CreateAdPolicy;
CreateAdPolicy = {
    validate: function(req, res, next) {
        const createAdSchema = Joi.object().keys({
            trade_type: Joi.string().required(),
            coin: Joi.string().required(),
            currency: Joi.string().empty(''),
            exchange_rate: Joi.number().precision(2).required(),
            amount_to_trade: Joi.number().precision(2).required(),
            trade_fee: Joi.number().precision(2).required(),
            mincoin_amount: Joi.number().precision(2).required(),
            method_name: Joi.array().items(Joi.string().required()).single(),
            merchant_name: Joi.array().items(Joi.string().required()),
            account_name: Joi.array().items(Joi.string().min(5).required()).single(),
            account_number: Joi.array().items(Joi.number().integer().positive().required()),
            trade_terms: Joi.any().optional(''),
            payment_timeout: Joi.string().empty(''),
            reject_unverified_users: Joi.boolean(),
            user_id: Joi.string().required()
        });
        // validating the user input against the defined configurations here
        const { error, value } = Joi.validate(req.body, createAdSchema);
        // if there's an error in the input , then do this
        if (error) {
            switch (error.details[0].context.key) {
                case 'trade_type':
                    res.status(500)
                        .json({
                            message: error.details[0].message,
                            success: false,
                            results: null
                        });
                    break;
                case 'coin':
                    res.status(500)
                        .json({
                            message: error.details[0].message,
                            success: false,
                            results: null
                        });
                    break;
                case 'currency':
                    res.status(500)
                        .json({
                            message: error.details[0].message,
                            success: false,
                            results: null
                        });
                    break;
                case 'exchange_rate':
                    res.status(500)
                        .json({
                            message: error.details[0].message,
                            success: false,
                            results: null
                        });
                    break;
                case 'amount_to_trade':
                    res.status(500)
                        .json({
                            message: error.details[0].message,
                            success: false,
                            results: null
                        });
                    break;
                case 'trade_fee':
                    res.status(500)
                        .json({
                            message: error.details[0].message,
                            success: false,
                            results: null
                        });
                    break;
                case 'mincoin_amount':
                    res.status(500)
                        .json({
                            message: error.details[0].message,
                            success: false,
                            results: null
                        });
                    break;
                case 'method_name':
                    res.status(500)
                        .json({
                            message: error.details[0].message,
                            success: false,
                            results: null
                        });
                    break;
                case 'merchant_name':
                    res.status(500)
                        .json({
                            message: error.details[0].message,
                            success: false,
                            results: null
                        });
                    break;
                case 'account_name':
                    res.status(500)
                        .json({
                            message: error.details[0].message,
                            success: false,
                            results: null
                        });
                    break;
                case 'account_number':
                    res.status(500)
                        .json({
                            message: error.details[0].message,
                            success: false,
                            results: null
                        });
                    break;
                case 'trade_terms':
                    res.status(500)
                        .json({
                            message: error.details[0].message,
                            success: false,
                            results: null
                        });
                    break;
                case 'payment_timeout':
                    res.status(500)
                        .json({
                            message: error.details[0].message,
                            success: false,
                            results: null
                        });
                    break;
                case 'reject_unverified_users':
                    res.status(500)
                        .json({
                            message: error.details[0].message,
                            success: false,
                            results: null
                        });
                    break;
                default:
                    res.status(500)
                        .json({
                            message: 'Invalid information provided',
                            success: false,
                            results: error.details[0].message
                        });
                    break;
            }
        } else {
            next();
        }
    }
}

// exporting the configuration globally
module.exports = CreateAdPolicy;