let mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    Users  = require("./models/user_verification");

let UserVerificationSchema = new Schema({
    token: {
        type: String,
        required: true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

const CompactUserVerificationSchema = mongoose.model('User_Verification',UserVerificationSchema);

module.exports = CompactUserVerificationSchema;