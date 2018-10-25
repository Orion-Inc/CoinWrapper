const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Related  schemas will be declared here
const Users = require("@models/users/users");

// Instantiating the schema to create a model
const WalletStatusSchema = new Schema({
    wallet_identifier: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true,
        default: false
    },
    user_email: {
        type: String,
        required: true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    }
},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

//middleware may be here

// binding the schema to create a model
const Wallet = mongoose.model('WalletStatus', WalletStatusSchema);
module.exports = Wallet;