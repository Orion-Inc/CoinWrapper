require("module-alias/register");
let app = require("express"),
    Users = require("@models/users/users"),
    jwt = require("jsonwebtoken"),
    Resolvers = require("@utils/resolvers"),
    User_Verification = require("@models/users/user_verification"),
    tokenNotifier = require("@utils/nodemailer"),
    config = require("@conn/connectionString");

let SignInController;
SignInController = {
    authenticate: function (req, res) {
        let login_credentials = req.body.credentials;
        let login_password = req.body.password || "";
        let auth_method = Resolvers.formatString('u', req.body.auth_method);

        if (!isNaN(login_credentials) && auth_method !== "") {
            //Login if it is a number - phone number
            Users.findOne({phone: login_credentials }).exec(function (err, user) {
                if (!user) {
                    res.status(404)
                        .json({
                            message: 'Phone number not found',
                            results: null,
                            success: false
                        });
                } else if (user) {
                    if(login_password !== "") {
                        Resolvers.comparePassword(login_password, user.password).then((results) => {
                            if(results) {
                                const payload = {
                                    user_id: user._id,
                                    firstname: user.firstname,
                                    othername: user.othername,
                                    username: user.username,
                                    email: user.email,
                                    phone_number: user.phone
                                };
                                let token = jwt.sign(payload, config.secret, {
                                    algorithm: 'HS256',
                                    expiresIn: '7200s' // 300s
                                });
                                res.status(200)
                                    .json({
                                        message: 'User Profile Found',
                                        results: user,
                                        success: true,
                                        meta: {
                                            token: token
                                        }
                                    });
                            } else {
                                res.status(403)
                                    .json({
                                        message: 'Password is incorrect',
                                        success: false,
                                        results: null
                                    })
                            }
                        })
                    } else {
                        // password is null or empty
                        const payload = {
                            user_id: user._id,
                            firstname: user.firstname,
                            othername: user.othername,
                            username: user.username,
                            email: user.email,
                            phone_number: user.phone
                        };
                        let token = jwt.sign(payload, config.secret, {
                            algorithm: 'HS256',
                            expiresIn: '7200s' // 300s
                        });
    
                        //Sending login url with token base on the user option
                        if (auth_method === "EMAIL") {
                            //Sending the login url for user to login
                            tokenNotifier('orionghana.io@gmail.com', user.email, user.firstname + ' ' + user.othername, token, "Signing In");
                        } else if (auth_method === "SMS") {
                            //Sending the login url thru sms from here
    
                        }
                        res.status(200)
                            .json({
                                message: 'User Profile Found, Please visit your email to login',
                                results: user,
                                success: true,
                                meta: {
                                    token: token
                                }
                            });
                    }
                }

            });

        } else if (Resolvers.verificationEmail(login_credentials) && auth_method !== "") {
            Users.findOne({email: login_credentials }).exec(function (err, user) {
                if (!user) {
                    res.status(404)
                        .json({
                            message: 'Email Address not found',
                            results: null,
                            success: false
                        });
                    //Redirect the user to the sign up
                    // res.redirect(401, '/signup');
                } else if (user) {
                    if(login_password !== "") {
                        Resolvers.comparePassword(login_password, user.password).then((results) => {
                            if(results) {
                                const payload = {
                                    user_id: user._id,
                                    firstname: user.firstname,
                                    othername: user.othername,
                                    username: user.username,
                                    email: user.email,
                                    phone_number: user.phone
                                };
            
                                let token = jwt.sign(payload, config.secret, {
                                    algorithm: 'HS256',
                                    expiresIn: '7200s'
                                });
                                res.status(200)
                                    .json({
                                        message: 'User Profile Found',
                                        results: user,
                                        success: true,
                                        meta: {
                                            token: token
                                        }
                                    });
                            } else {
                                res.status(403)
                                    .json({
                                        message: 'Password is incorrect',
                                        success: false,
                                        results: null
                                    })
                            }
                        });
                    } else {
                        const payload = {
                            user_id: user._id,
                            firstname: user.firstname,
                            othername: user.othername,
                            username: user.username,
                            email: user.email,
                            phone_number: user.phone
                        };
    
                        let token = jwt.sign(payload, config.secret, {
                            algorithm: 'HS256',
                            expiresIn: '7200s'
                        });
    
                        //Sending login url with token base on the user option
                        if (auth_method === "EMAIL") {
                            //Sending the login url for user to login
                            tokenNotifier('orionghana.io@gmail.com', user.email, user.firstname + ' ' + user.othername, token, "Signing In");
    
                        } else if (auth_method === "SMS") {
                            //Sending the login url thru sms from here
                        }
    
                        res.status(200)
                            .json({
                                message: 'User Profile Found, Please visit your email to log in',
                                results: user,
                                success: true,
                                meta: {
                                    token: token
                                }
                            });
                    }
                }
            });
        } else {
            res.status(401)
                .json({
                    message: 'Invalid Input Type',
                    results: null,
                    success: false
                });
        }
    }
};
module.exports = SignInController;