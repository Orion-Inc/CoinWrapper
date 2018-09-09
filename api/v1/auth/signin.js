require('module-alias/register');
let express = require("express"),
    Users = require("@models/users"),
    jwt = require("jsonwebtoken"),
    Resolvers = require("@utils/resolvers"),
    User_Verification = require("@models/user_verification"),
    tokenNotifier = require("@utils/nodemailer"),
    config = require("@conn/connectionString");

app = express();
signinRouter = express.Router();
signinRouter.post('/authenticate',function(req,res){
    let login_credentials = req.body.credentials;
    let auth_method = Resolvers.formatString('u',req.body.auth_method);

    if (!isNaN(login_credentials) && auth_method !== ""){
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
                const payload = {
                    user_id: user._id
                };

                let token = jwt.sign(payload, config.secret,{
                    algorithm: 'HS256',
                    expiresIn: '300s'
                });

                //Sending login url with token base on the user option
                if (auth_method === "EMAIL") {
                    //Sending the login url for user to login
                    tokenNotifier('lordkay1996@gmail.com',user.email,user.firstname + ' ' + user.othername,token);
                } else if (auth_method === "SMS") {
                    //Sending the login url thru sms from here

                }
                res.status(200)
                    .json({
                        message: 'User Profile Found',
                        results: user,
                        success: true,
                        meta:{
                            token: token
                        }
                    });
            }

        });

    }else if (Resolvers.verificationCode(login_credentials) && auth_method !== ""){
        Users.findOne({ email: login_credentials }).exec(function(err,user){
            if (!user){
                res.status(404)
                    .json({
                        message: 'Email Address not found',
                        results: null,
                        success: false
                    });
                //Redirect the user to the sign up
                res.redirect(401,'/signup');
            } else if(user){
                const payload = {
                    user_id: user._id
                };

                let token = jwt.sign(payload, config.secret,{
                    algorithm: 'HS256',
                    expiresIn: '300s'
                });

                //Sending login url with token base on the user option
                if (auth_method === "EMAIL") {
                    //Sending the login url for user to login
                    tokenNotifier('lordkay1996@gmail.com',user.email,user.firstname + ' ' + user.othername,token);

                } else if (auth_method === "SMS") {
                    //Sending the login url thru sms from here

                }

                res.status(200)
                    .json({
                        message: 'User Profile Found',
                        results: user,
                        success: true,
                        meta:{
                            token: token
                        }
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

module.exports = signinRouter;