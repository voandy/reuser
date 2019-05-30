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
  var review = new Review({
    userId:req.params.userId,
    leftById:req.params.leftById,
    datePosted: new Date(),
    title:req.body.title,
    content:req.body.content,
    starRating:req.body.starRating
  });

  // save new review
  review.save(function (err,newReview) {
    if (err){
      res.status(400);
    }
  });

  // update average user rating
  var userId = req.params.userId;

  Review.find({userId:userId}, function(err, reviews){
    var reviewCount = 0;
    var starTotal = 0;
    var starRatingAvg = 0;

    reviews.forEach(function(review) {
      reviewCount ++;
      starTotal += review.starRating;
    });
    starRatingAvg = starTotal / reviewCount;

    User.findByIdAndUpdate(userId, {starRatingAvg:starRatingAvg},
      {runValidators:true}, function(err, user) {
      if (err){
        res.status(404);
      }
    });
  });

  res.send(newReview);
};

// delete review by id
var deleteById = function(req,res){
  var reviewId = req.params.id;
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

// given a userId returns all review written ABOUT that user
var getByUser = function(req,res){
  var userId = req.params.userId;
  Review.find({userId:userId}, function(err, reviews){
    if (!err){
      res.send(reviews);
    }else{
      res.status(404);
    }
  });
}

// given a userId returns all review written ABOUT that user
var getByLeftUser = function(req,res){
  var userId = req.params.userId;
  Review.find({leftById:userId}, function(err, reviews){
    if (!err){
      res.send(reviews);
    }else{
      res.status(404);
    }
  });
}

module.exports.getAll = getAll;
module.exports.getById = getById;
module.exports.create = create;
module.exports.deleteById = deleteById;
module.exports.updateById = updateById;
module.exports.getByUser = getByUser;
module.exports.getByLeftUser = getByLeftUser;

