let express = require("express"),
    Users   = require("../models/users"),
    jwt  = require("jsonwebtoken"),
    Resolvers = require("../utils/resolvers"),
    User_Verification = require("../models/user_verification"),
    tokenNotifier = require("../utils/nodemailer"),
    config = require("../config");
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
                const payload = {
                    user_id: user._id
                };

                let token = jwt.sign(payload, config.secret,{
                    algorithm: 'HS256',
                    expiresIn: '300s'
                });

                //Sending the login url for user to login
                tokenNotifier('lordkay1996@gmail.com',user.email,user.firstname + ' ' + user.othername,token);

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
                const payload = {
                    user_id: user._id
                };

                let token = jwt.sign(payload, config.secret,{
                    algorithm: 'HS256',
                    expiresIn: '300s'
                });

                //Sending the login url for user to login
                tokenNotifier('lordkay1996@gmail.com',user.email,user.firstname + ' ' + user.othername,token);

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

// Middleware for checking the authentication data
coinageRouter.use(function(req,res,next){
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token,config.secret,{
            algorithm: ['HS256']
        },function(err,decoded){
            if (err){
                res.status(401)
                    .json({
                        message: 'Failed To Authenticate',
                        results: null,
                        success: false,
                    });
            } else {
                //checking if token is expired
                let current_time = new Date().getTime() / 1000;
                if (current_time > decoded.expiresIn){
                    res.status(401)
                        .json({
                            message: 'Session Has Expired',
                            results: null,
                            success: false
                        });
                } else {
                    req.decoded = decoded;
                    next();
                }
            }
        });
    } else {
        res.status(401)
            .json({
                message: 'No Token provided',
                success: false,
            });
    }

});


coinageRouter.get('/home',function(req,res){
    res.status(200).json({
        message: "Yay"
    })
});


module.exports = coinageRouter;




