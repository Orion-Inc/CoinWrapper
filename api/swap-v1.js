//Register the module aliases here
require('module-alias/register');
let express = require("express"),
    SignUpRouter = require("./v1/auth/signup"),
    SignInRouter = require("./v1/auth/signin"),
    AuthorizationGuard = require("@guards/authorizationGuard"),
    DashboardRouter = require("./v1/user/dashboard"),
    WalletRouter = require("./v1/wallet/wallet"),
    app = express();

let apiAuth = express.Router();
//Sign up and login route will be here
apiAuth.use('/auth',[SignUpRouter,SignInRouter]);
//Middleware for checking the authentication data
apiAuth.use(AuthorizationGuard);
//Authorization routes will appear here
apiAuth.use('/user', [DashboardRouter,WalletRouter]);

module.exports = apiAuth;



