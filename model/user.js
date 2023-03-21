var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password:  {
        type: String,
        required: true
    },
    name:  {
        type: String,
        default: "User Name"
    },
    YOB:  {
        type: String,
        default:"2001"
    },
    isAdmin:  {
        type: Boolean,
        required: true,
        default: false
    },
    otp: {
        type: String,
        default: null
    },
    otpExpiration: {
        type: Date,
        default: null
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true });
userSchema.statics.updateOTP = function(email, otp, expirationDate) {
    return this.findOneAndUpdate(
      { email: email },
      { $set: { otp: otp, otpExpiration: expirationDate } }
    );
  };
module.exports = mongoose.model('users', userSchema);
