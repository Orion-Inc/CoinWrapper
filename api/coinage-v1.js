let express = require("express"),
    Users   = require("../models/users"),
    Resolvers = require("../utils/resolvers"),
    User_Verification = require("../models/user_verification"),
    tokenNotifier = require("../utils/nodemailer");
    app = express();

let coinageRouter = express.Router();

//Login Route Here
coinageRouter.post('/authenticate',function(req,res){
    const login_credentials = req.body.credentials;
    if (!isNaN(login_credentials)){
        //Login if it is a number - phone number
        Users.findOne({ phone: login_credentials }).exec(function(err,user){
            if (!user){
                res.status(404)
                    .json({
                        message: 'Phone number not found',
                        results: null,
                        success: false
                    });
            } else if(user){
                res.status(200)
                    .json({
                        message: 'User Profile Found',
                        results: user,
                        success: true
                    });
            }

        });

    }else if (Resolvers.verificationCode(login_credentials)){
        Users.findOne({ email: login_credentials }).exec(function(err,user){
            if (!user){
                res.status(404)
                    .json({
                        message: 'Email Address not found',
                        results: null,
                        success: false
                    });
            } else if(user){

                res.status(200)
                    .json({
                        message: 'User Profile Found',
                        results: user,
                        success: true
                    });
            }
        });
    }else{
        res.status(401)
            .json({
                message: 'Invalid Input Type',
                results: null,
                success: false
            });
    }
});

// Middleware for checking the authentication data
app.use(function(req,res,next){

});

module.exports = coinageRouter;




