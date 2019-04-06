const mongoose = require('mongoose');
const Review = mongoose.model('review');
var reviewFunc = require('./functions/review-functions.js');

// get all reviews
var getAll = function(req,res){
  Review.find(function(err,reviews){
    if(!err){
      res.send(reviews);
    }else{
      res.sendStatus(404);
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
// TODO: As well as creating a review object the create function should get
// the user the rewiew is for and add its own id as a foreign key for that user
var create = function(req,res){
  // TODO
};

// delete review by id
var deleteById = function(req,res){
  var reviewId = req.params.id;
  Review.findByIdAndRemove(reviewId, function(err, review){
    if (!err){
      res.send(reviewId + "deleted.");
    }else{
      res.status(404);
    }
  });
};

// update review by id
// TODO: Check functionality
var updateById = function(req,res){
  var reviewId = req.params.id;
  var updatedFields = req.body;
  User.findByIdAndUpdate(reviewId, req.body, function(err, review){
    if (!err){
      res.send(reviewId + "updated.");
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
