//Register the module aliases here
require('module-alias/register');
let express = require("express"),
    Users   = require("../models/users"),
    jwt  = require("jsonwebtoken"),
    Resolvers = require("../utils/resolvers"),
    User_Verification = require("../models/user_verification"),
    tokenNotifier = require("../utils/nodemailer"),
    config = require("@conn/connectionString"),
    SignUpRouter = require("./v1/auth/signup"),
    SignInRouter = require("./v1/auth/signin"),
    app = express();

let apiAuth = express.Router();
//Sign up and login route will be here
apiAuth.use('/auth',[SignUpRouter,SignInRouter]);
//Middleware for checking the authentication data
apiAuth.use(function(req,res,next){
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token,config.secret,{
            algorithm: ['HS256']
        },function(err,decoded){
            if (err){
                res.status(401)
                    .json({
                        message: 'Failed To Authenticate. Session has expired',
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

apiAuth.get('/auth/:email',function(req,res){
    let email = req.params.email;
    res.status(200).json({
        message: "Yay"
    })
});

module.exports = apiAuth;




