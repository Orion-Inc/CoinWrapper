require('module-alias/register');
let express = require("express"),
    SignInController = require("@controllers/auth/SignInController");

signinRouter = express.Router();
//Routes
signinRouter.post('/authenticate',SignInController.authenticate);

module.exports = signinRouter;