require("module-alias/register");
let express = require("express"),
    Users = require("@models/users/users");

let DashboardController;
DashboardController = {
    redirect: function(req,res){

    },
    index: function(req,res){
        const user_id = req.decoded;
        res.status(200)
            .json({
                message: "User details found",
                success: true,
                results: null,
            });
    }
};

module.exports = DashboardController;