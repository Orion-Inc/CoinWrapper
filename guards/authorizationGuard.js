require("module-alias/register");
let express = require("express"),
    jwt = require("jsonwebtoken"),
    config = require("@conn/connectionString");

app = express();
authorizationGuard = express.Router();
authorizationGuard.use(function(req,res,next){
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
                req.decoded = decoded;
                next();
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
//Exporting the module
module.exports = authorizationGuard;
