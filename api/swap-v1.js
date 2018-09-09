//Register the module aliases here
require('module-alias/register');
let express = require("express"),
    SignUpRouter = require("./v1/auth/signup"),
    SignInRouter = require("./v1/auth/signin"),
    app = express();

let apiAuth = express.Router();
//Sign up and login route will be here
apiAuth.use('/auth',[SignUpRouter,SignInRouter]);
//Middleware for checking the authentication data


apiAuth.get('/auth/:email',function(req,res){
    let email = req.params.email;
    res.status(200).json({
        message: "Yay"
    })
});

module.exports = apiAuth;




