const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var enums = require('./enums');

const userSchema = new Schema(
  {
    email:String,
    dateJoined:{type: Date, default: Date.now},

    password:String,
    passwordSalt:String,

    firstName:String,
    lastName:String,

    addressLine1:String,
    addressLine2:String,
    suburb:String,
    state:{type: String, enum: Object.values(enums.State)},
    phoneNo:String,

    thanksReceived:Number,
    // derived star rating average
    starRatingAvg:Number,

    // array of ids of listings this user has created
    listingIds:[String],

    // array of ids for review received
    reviewReceived:[String]
  }
);

mongoose.model('user',userSchema);
