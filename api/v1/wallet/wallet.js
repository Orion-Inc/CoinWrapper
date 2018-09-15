require("module-alias/register");
const express  = require("express");
const WalletController = require("@controllers/wallet/WalletController");
 WalletRouter = express.Router();

 //Activating the router controller here --> prepending to the redirect authorize coinbase wallet
WalletRouter.get('/wallet/all', WalletController.all);
WalletRouter.post('/wallet/create', WalletController.create);

module.exports = WalletRouter;

