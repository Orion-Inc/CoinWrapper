//configuring the sign in here --> Seperation of concerns
require('module-alias/register');
let express = require("express");
// adding controllers here
let SignUpController = require("@controllers/auth/SignUpController");

//Defining the base application stuff here
app = express();

signupRouter = express.Router();
signupRouter.post('/signup',SignUpController.index);

module.exports = signupRouter;