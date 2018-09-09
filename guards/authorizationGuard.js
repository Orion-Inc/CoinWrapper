let express = require("express"),
    jwt = require("jsonwebtoken"),
    config = require("@conn/connectionString");

app = express();
authorizationGuard = express.Router();

//Exporting the module
module.exports = authorizationGuard;
