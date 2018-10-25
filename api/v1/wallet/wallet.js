require("module-alias/register");
const express  = require("express");
const WalletController = require("@controllers/wallet/WalletController");

//importing the policies here
const WalletPolicy = require("@policies/WalletPolicy");
 WalletRouter = express.Router();

 //Activating the router controller here --> prepending to the redirect authorize coinbase wallet
WalletRouter.post('/wallet/all', WalletController.all);
WalletRouter.post('/wallet/normal', WalletController.getNormalWallet);
WalletRouter.post('/wallet/hd', WalletController.getHDWallet);
WalletRouter.post('/wallet/create', 
    WalletPolicy.createWallet,
    WalletController.create
);
WalletRouter.delete(
    '/wallet/delete',
    WalletPolicy.deleteWallet,
    WalletController.delete
);

module.exports = WalletRouter;

