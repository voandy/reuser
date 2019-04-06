const mongoose = require('mongoose');
const Listing = mongoose.model('listing');
var listingFunc = require('./functions/listing-functions.js');

// get all listings
var getAll = function(req,res){
  Listing.find(function(err,listings){
    if(!err){
      res.send(listings);
    }else{
      res.sendStatus(404);
    }
  });};

// get listing by id
var getById = function(req,res){
  var listingId = req.params.id;
  Listing.findById(listingId, function(err,listing){
    if(!err){
      res.send(listing);
    }else{
      res.sendStatus(404);
    }
  });
};

// create listing
// TODO: As well as creating a listing object the create function should get
// the user who made it and add its own id as a foreign key for that user
var create = function(req,res){
  // TODO
};

// delete listing by id
var deleteById = function(req,res){
  var listingId = req.params.id;
  Listing.findByIdAndRemove(userId, function(err, listing){
    if (!err){
      res.send(listingId + "deleted.");
    }else{
      res.status(404);
    }
  });
};

// update listing by id
// TODO: Check functionality
var updateById = function(req,res){
  var listingId = req.params.id;
  var updatedFields = req.body;
  Listing.findByIdAndUpdate(userId, req.body, function(err, listing){
    if (!err){
      res.send(listingId + "updated.");
    }else{
      res.status(404);
    }
  });
};

// get listings filtered by location, category or search term
var filterListings = function(req,res){
  // TODO
};

module.exports.getAll = getAll;
module.exports.getById = getById;
module.exports.create = create;
module.exports.deleteById = deleteById;
module.exports.updateById = updateById;

module.exports.filterListings = filterListings;
