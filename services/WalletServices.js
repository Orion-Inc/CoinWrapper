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
    getAllWalletByUser(coin_type, token) {
        return Axios.get('/v1/' + coin_type + '/main/wallets?token=' + token);
    },
    getSingleWalletByUser(coin_type, wallet_name, token) {
        return Axios.get('/v1/' + coin_type + '/main/wallets/hd/' + wallet_name + '?token=' + token);
    },
    getNormalWalletByName(coin_type, wallet_name, token) {
        return Axios.get('/v1/' + coin_type + '/main/wallets/' + wallet_name + '/addresses?token=' + token);
    },
    getHDWalletByName(coin_type, wallet_name, token) {
        return Axios.get('/v1/' + coin_type + '/main/wallets/hd/' + wallet_name + '/addresses?token=' + token);
    },
    createNormalWallet(coin_type, token, data) {
        return Axios.post('/v1/' + coin_type + '/main/wallets?token=' + token, JSON.stringify(data));
    },
    createHDWallet(coin_type, token, data) {
        return Axios.post('/v1/' + coin_type +'/main/wallets/hd?token=' + token, JSON.stringify(data))
    },
    deleteNormalWallet(coin_type, token, name) {
        return Axios.delete('/v1/' + coin_type + '/main/wallets/' + name + '?token=' + token);
    },
    deleteHDWallet(coin_type, token, name) {
        return Axios.delete('/v1/' + coin_type + '/main/wallets/hd/' + name + '?token=' + token);
    },
    addAddressToWallet(coin_type, wallet_name, token, data) {
        return Axios.post('/v1/' + coin_type + '/main/wallets/' + wallet_name + '/addresses?token=' + token, JSON.stringify(data));
    },
    createTransaction(newtx){
        return Axios.post('/v1/bcy/test/txs/new', JSON.stringify(newtx));
    }
};

// exporting the module to be used globally
module.exports = WalletServices;