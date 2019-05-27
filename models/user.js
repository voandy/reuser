const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var random = require('mongoose-simple-random');
var enums = require('./enums');

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true
    },

    name: {
      type: String,
      required: true
    },

    password: {
      type: String,
      required: true
    },

    dateJoined:{type: Date, default: Date.now},

    formattedAddress: String,

    longitude:Number,
    latitude:Number,

    phoneNo:String,

    thanksReceived:Number,

    // derived star rating average
    starRatingAvg:Number,

    profilePicURL:String
  }
);

// adds a method which get's random users for testing
userSchema.plugin(random);

// assign state object to userSchema
userSchema.statics.States = enums.States;

const User = mongoose.model('user',userSchema);

module.exports = User;
