require("module-alias/register");
const express  = require("express");
const WalletController = require("@controllers/wallet/WalletController");

//importing the policies here
const WalletPolicy = require("@policies/WalletPolicy");
 WalletRouter = express.Router();

WalletRouter.get('/wallet/address/generate',
    WalletController.generateAddress
);
 //Activating the router controller here --> prepending to the redirect authorize coinbase wallet
WalletRouter.post('/wallet/all', WalletController.all);
// WalletRouter.post('/wallet/normal', WalletController.getNormalWallet);
// WalletRouter.post('/wallet/hd', WalletController.getHDWallet);
WalletRouter.post('/wallet/create', 
    WalletPolicy.createWallet,
    WalletController.create
);

// adding address to wallet endpoint
WalletRouter.post('/wallet/:wallet_name/addresses/add',
    WalletController.addAddressToWallet
);
WalletRouter.post('/wallet/transaction/new',
    WalletController.initTransaction
);
WalletRouter.get('/wallet/:wallet_name/addresses',
    WalletController.details
);

WalletRouter.delete(
    '/wallet/delete',
    WalletPolicy.deleteWallet,
    WalletController.delete
);

module.exports = WalletRouter;

