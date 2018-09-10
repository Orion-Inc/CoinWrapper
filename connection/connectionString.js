require('dotenv').config();
module.exports = {
    'secret':process.env.DB_SECRET || "Iloveprogramming7*&*scotch.io*&withmymom",
    'database': process.env.DB_STRING
}