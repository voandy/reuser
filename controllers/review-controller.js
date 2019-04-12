const mongoose = require('mongoose');

const Review = mongoose.model('review');
const User = mongoose.model('user');

// get all reviews
var getAll = function(req,res){
  Review.find(function(err,reviews){
    if(!err){
      res.send(reviews);
    }else{
      res.status(400);
    }
  });
};

// get review by id
var getById = function(req,res){
  var reviewId = req.params.id;
  Review.findById(reviewId, function(err,review){
    if(!err){
      res.send(review);
    }else{
      res.sendStatus(404);
    }
  });
};

// create review
var create = function (req,res) {
  // TODO: Update user's average star rating when a review is added
  var userId = req.params.userId;

  var review = new Review({
    title:req.body.title,
    contents:req.body.contents,
    starRating:req.body.starRating
  });

  review.save(async (err,newReview) => {
    if (!err){
      // add review id to user's foreign keys
      await User.findByIdAndUpdate(userId, {"$push": {"reviewIds" : newReview._id.str}});
      res.send(newReview);
    }else{
      res.status(400);
    }
  });
};

// delete review by id
var deleteById = function(req,res){
  var reviewId = req.params.reviewId;
  var userId = req.params.userId;

  // remove reviewId from user foreign keys
  User.findByIdAndUpdate(userId, { $pull: {reviewIds : reviewId} }, function(err){
    if (err){
      res.status(400);
    }
  });

  // delete review
  Review.findByIdAndRemove(reviewId, function(err, review){
    if (!err){
      res.send(reviewId + " deleted.");
    }else{
      res.status(404);
    }
  });
};

// update review by id
var updateById = function(req,res){
  var reviewId = req.params.id;
  var updatedFields = req.body;
  Review.findByIdAndUpdate(reviewId, req.body, function(err, review){
    if (!err){
      res.send(reviewId + " updated.");
    }else{
      res.status(404);
    }
  });
};

module.exports.getAll = getAll;
module.exports.getById = getById;
module.exports.create = create;
module.exports.deleteById = deleteById;
module.exports.updateById = updateById;
