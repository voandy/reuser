const mongoose = require('mongoose');
const Listing = mongoose.model('listing');

// get all listings
var getAll = function(req,res){
  // TODO
};

// get listing by id
var getById = function(req,res){
  // TODO
};

// create listing
var create = function(req,res){
  // TODO
};

// delete listing by id
var deleteById = function(req,res){
  // TODO
};

// update listing by id
var updateById = function(req,res){
  // TODO
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
