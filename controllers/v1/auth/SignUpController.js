require("module-alias/register");
let express = require("express"),
    Users = require("@models/users/users"),
    jwt = require("jsonwebtoken"),
    Resolvers = require("@utils/resolvers"),
    User_Verification = require("@models/users/user_verification"),
    tokenNotifier = require("@utils/nodemailer"),
    config = require("@conn/connectionString");
    app = express();

let SignUpController;
SignUpController = {
    index: function (req, res) {
        let Query = new Users({
            firstname: req.body.firstname,
            othername: req.body.othername,
            username: req.body.username,
            email: req.body.email,
            phone: req.body.phone
        });

        //Check if the user already exists
        Users.findOne({email: Query.email, phone: Query.phone}, function (err, user) {
            if (err) {
                throw err;
            }

            if (!user) {
                Query.save(function (err, results) {
                    if (!err) {
                        // Using jwt instead for the token generation
                        const payload = {
                            user_id: results._id,
                            firstname: results.firstname,
                            othername: results.othername,
                            email: results.email,
                            username: results.username,
                            phone_number: results.phone
                        };
                        let uriToken = jwt.sign(payload, config.secret, {
                            algorithm: 'HS256',
                            expiresIn: '300s'
                        });
                        // A four digit verification token
                        let genToken = Resolvers.verificationCode(10000, 99999);

                        let Verification = new User_Verification({
                            token: genToken,
                            user_id: results._id
                        });

                        Verification.save(function (err, data) {
                            if (!err) {
                                const fullname = results.firstname + "  " + results.othername;
                                tokenNotifier('orionghana.io@gmail.com', results.email, fullname, uriToken, "Signing Up");

                                res.status(201).json({
                                    message: "User Profile Successfully Created\n An Email has been sent to your " + results.email + " .",
                                    success: true
                                });
                            } else {
                                res.status(401)
                                    .json({
                                        message: 'An error occurred while saving access token',
                                        success: false
                                    });
                            }
                        });
                    } else {
                        console.log(err);
                        res.status(401)
                            .json({
                                message: 'An error occurred while saving to user data',
                                success: false
                            });
                    }
                })
            } else if (user) {
                res.status(401).json({
                    message: 'User already Exists',
                    success: false
                })
            }
        })

    }
};

module.exports = SignUpController;