require("module-alias/register");
const express = require("express");
const Axios = require("@vendors/Axios");
const _ = require("lodash");

let WalletServices;
WalletServices = {
    generateAddress(coin_type) {
        return Axios.post('/v1/' + coin_type + '/test3/addrs');
    },
    generateMultisigAddress(coin_type, data) {
        return Axios.post('/v1/' + coin_type + '/test3/addrs', JSON.stringify(data));
    },
    createNormalWallet(coin_type, token, data) {
        return Axios.post('/v1/' + coin_type + '/main/wallets?token' + token, JSON.stringify(data));
    },
    createHDWallet(coin_type, token, data) {
        return Axios.post('/v1/' + coin_type +'/main/wallets/hd?token=' + token, JSON.stringify(data))
    }
};

// exporting the module to be used globally
module.exports = WalletServices;