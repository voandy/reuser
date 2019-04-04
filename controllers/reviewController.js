const mongoose = require('mongoose');
const Listing = mongoose.model('review');

// get all reviews
var getAll = function(req,res){
  // TODO
};

// get review by id
var getById = function(req,res){
  // TODO
};

// create review
var create = function(req,res){
  // TODO
};

// delete review by id
var deleteById = function(req,res){
  // TODO
};

// update review by id
var updateById = function(req,res){
  // TODO
};

module.exports.getAll = getAll;
module.exports.getById = getById;
module.exports.create = create;
module.exports.deleteById = deleteById;
module.exports.updateById = updateById;
