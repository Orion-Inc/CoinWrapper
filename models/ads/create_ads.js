const mongoose = require("mongoose");
const Schema  = mongoose.Schema;

// instantiating the schema here to bind to the model container
const CreateAdSchema = new Schema({
    trade_type: {
        type: String,
        required: true,
        default: null
    },
    coin: {
        type: String,
        required: true,
        default: null
    },
    currency: {
        type: String,
        required: false,
        default: null
    },
    exchange_rate: {
        type: [Number, String],
        required: true,
        default: null
    },
    amount_to_trade: {
        type: Number,
        required: true,
        default: null
    },
    trade_fee: {
        type: Number,
        required: true,
        default: null
    },
    mincoin_amount: {
        type: Number,
        required: true,
        default: null
    },
    payment_method: {
        type: String,
        required: true,
        default: null
    },
    merchant_name: {
        type: String,
        required: true,
        default: null
    },
    account_name: {
        type: String,
        required: true,
        default: null
    },
    account_number: {
        type: Number,
        required: true,
        default: null
    },
    trade_terms: {
        type: String,
        required: false,
        default: null
    },
    payment_timeout: {
        type: String,
        required: false,
        default: null
    },
    reject_unverified_users: {
        type: Boolean
    }
},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

// middleware hooks will be here
CreateAdSchema.pre('remove',function (next) {
});

CreateAdSchema.pre('update', function (next) {
    this.update({}, { $set: { updated_at: Date.now() }});
    next();
})

// Binding the schema with mongoose model object to create a document here
const CreateAds = mongoose.model('Create_Ads', CreateAdSchema);
module.exports = CreateAds;