const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
  {
    // user the review describes
    userId:String,
    // user who left this review
    leftById:String,

    title:String,
    contents:String,
    starRating:{type:Number, min:1, max:5}
  }
);

mongoose.model('review',reviewSchema);
