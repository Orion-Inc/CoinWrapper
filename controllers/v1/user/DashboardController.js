require("module-alias/register");
let express = require("express"),
    Users = require("@models/users/users"),
    CreateAds = require("@models/ads/create_ads"),
    _ = require("lodash");

let DashboardController;
DashboardController = {
    reroute: function(req,res){
        const user_email = req.params.email;
        const token = req.query.token;
        if (user_email !== '' || user_email !== null){
            res.redirect(process.env.APP_PROD_URL + '/authorize/');
        } else {
            res.status(403)
                .json({
                    message: 'No way Jose, Unauthorize Access to this page',
                    success: false,
                });
        }
    },
    index: function(req,res){
        const token_id = req.decoded;
        let Query = Users.findOne({ _id: { $eq : token_id.user_id } });
        Query.exec(function(err, results){
            res.status(200)
                .json({
                    message: "User details found",
                    success: true,
                    results: results,
                });
        });
    },
    createAds: function(req, res) {
        if (_.isEmpty(req.body)) {
            res.status(500)
                .json({
                    message: 'Form set cannot be empty',
                    success: false,
                    results: null
                });
        } else {
            // getting the details from the request body
            const generic_data = {
                trade_type: req.body.trade_type,
                coin: req.body.coin,
                currency: req.body.currency,
                exchange_rate: req.body.exchange_rate,
                amount_to_trade: req.body.amount_to_trade,
                trade_fee: req.body.trade_fee,
                mincoin_amount: req.body.mincoin_amount,
                trade_terms: req.body.trade_terms,
                payment_timeout: req.body.payment_timeout,
                reject_unverified_users: req.body.reject_unverified_users,
                user_id: req.body.user_id
            };

            const payment_details = {
                payment_method: {
                    method_name: req.body.method_name,
                    merchant_name: req.body.merchant_name,
                    account_name: req.body.account_name,
                    account_number: req.body.account_number
                }
            };
            // merging the two data and then saving the results to the database

            const createAd_details = _.assign(generic_data,payment_details);
            const details = new CreateAds(createAd_details);
            details.save( function (err, ad) {
                if (err) {
                    res.status(500)
                        .json({
                            message: 'An error occurred while creating an ad',
                            success: false,
                            results: err
                        });
                } else {
                    res.status(201)
                        .json({
                            message: 'Ad Successfully Created',
                            success: true,
                            results: ad
                        });
                }
            })

        }
    }
};

module.exports = DashboardController;