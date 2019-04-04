const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var enums = require('./enums');

const listingSchema = new Schema(
  {
    // user who made this listing
    userId:String,

    title:String,
    datePosted:{type: Date, default: Date.now},
    dateExpires:Date,

    addressLine1:String,
    addressLine2:String,
    suburb:String,
    state:{type: String, enum: Object.values(enums.State)},

    // derived from address using GoogleMaps API, required for filtering
    longitude:Number,
    latitude:Number,

    category:{type: String, enum: Object.values(enums.Category)},

    // min number of thanks required to view listing
    minVisibility:Number,

    // array of user ids who have given thanks for this listing
    thanksRecId:[String],

    // whether the listing is active or archived
    isActive:Boolean
  }
);

mongoose.model('listing',listingSchema);
