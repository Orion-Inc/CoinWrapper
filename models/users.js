let mongoose = require('mongoose'),
    User_Verification = require('./user_verification'),
    Schema = mongoose.Schema;

//Defining the mongoose schema here
let UserSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    othername: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: [Number,String],
        required: true
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


//Defining pre signals for the db operations here
UserSchema.pre('remove',function(next){
    User_Verification.remove({ user_id: this._id }).exec();
    next();
});

let CompactUserSchema = mongoose.model('Users', UserSchema);
module.exports = CompactUserSchema;