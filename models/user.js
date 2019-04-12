const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var random = require('mongoose-simple-random');
var enums = require('./enums');

const userSchema = new Schema(
  {
    email:String,
    dateJoined:{type: Date, default: Date.now},

    password:String,
    passwordSalt:String,

    firstName:String,
    lastName:String,

    address: {
      addressLine1:String,
      addressLine2:String,
      suburb:String,
      state:{type: String, enum: Object.values(enums.States)},
      postcode:{type:Number, min:0, max:9999}
    },

    phoneNo:String,

    thanksReceived:Number,
    // derived star rating average
    starRatingAvg:Number,

    // array of ids of listings this user has created
    listingIds:[String],

    // array of ids for review received
    reviewIds:[String]
  }
);

// adds a method which get's random users for testing
userSchema.plugin(random);

// assign state object to userSchema
userSchema.statics.States = enums.States;

mongoose.model('user',userSchema);
