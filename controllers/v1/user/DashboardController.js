require("module-alias/register");
let express = require("express"),
    Users = require("@models/users/users");

let DashboardController;
DashboardController = {
    reroute: function(req,res){
        const user_email = req.params.email;
        const token = req.query.token;
        if (user_email !== '' || user_email !== null){
            res.redirect(process.env.APP_LOCAL_URL + '/user/home');
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
    }
};

module.exports = DashboardController;