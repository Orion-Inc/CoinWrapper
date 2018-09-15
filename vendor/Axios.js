require("module-alias/register");
const Axios = require("axios");

// Creating an instance of a axios router
const Instance = Axios.create({
    baseURL: process.env.WALLET_BASE_URL
});
module.exports = Instance;