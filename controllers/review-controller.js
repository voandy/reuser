const mongoose = require('mongoose');
const Review  = mongoose.model('review');
const User    = mongoose.model('user');
const faker   = require('faker');

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
var create = function(req,res){
  var review = new Review({
    leftById:req.body.leftById,

    title:req.body.title,
    contents:req.body.contents,
    starRating:req.body.starRating
  });
  review.save(function(err,newReview){
    if(!err){
      res.send(newReview);
    }else{
      res.status(400).send(err);
    }
  });
};

// adds random reviews
var addRandom = function(req,res){
  var numReviews = req.params.n;

  for(var i=0; i<numReviews; i++){
    var review = new Review({
      leftById:"5ca9bc07da394e32944ad120",

      title:faker.lorem.sentence(),
      contents:faker.lorem.paragraph(),
      starRating:Math.floor(Math.random() * (5 - 1)) + 1
    });
    review.save(function(err,newReview){
      if(err){
        res.status(400).send(err);
      }
    });
  }
  res.send("Added " + numReviews + " reviews.");
};

// delete review by id
var deleteById = function(req,res){
  var reviewId  = req.params.id;
  var userId    = req.params.user;

  // remove reviewId in User db
  User.findByIdAndUpdate(userId, {$pull: {reviewIds : reviewId } },{new: true}, function(err, user){});
    
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

module.exports.addRandom = addRandom;
