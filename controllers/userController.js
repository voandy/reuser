const mongoose = require('mongoose');
const User = mongoose.model('user');

// get all users
var getAll = function(req,res){
  // TODO
};

// get user by id
var getById = function(req,res){
  // TODO
};

// create user
var create = function(req,res){
  // TODO
};

// delete user by email
var deleteByEmail = function(req,res){
  // TODO
};

// update user by email
var updateByEmail = function(req,res){
  // TODO
};

// get user by email
var getByEmail = function(req,res){
  // TODO
};

module.exports.getAll = getAll;
module.exports.getById = getById;
module.exports.create = create;
module.exports.deleteById = deleteById;
module.exports.updateById = updateById;

module.exports.getByEmail = getByEmail;
