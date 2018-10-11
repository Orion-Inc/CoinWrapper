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
            const Ad = new CreateAds(req.body);

        }
    }
};

module.exports = DashboardController;