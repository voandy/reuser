const mongoose = require('mongoose');
const User = mongoose.model('user');
var userFunc = require('./functions/user-functions.js');

// get all users
var getAll = function(req,res){
  User.find(function(err,users){
    if(!err){
      res.send(users);
    }else{
      res.sendStatus(404);
    }
  });
};

// get user by id
var getById = function(req,res){
  var userId = req.params.id;
  User.findById(userId, function(err,user){
    if(!err){
      res.send(user);
    }else{
      res.sendStatus(404);
    }
  });
};

// create user
var create = function(req,res){
  // TODO
};

// delete user by email
// TODO: Deleting a user should also delete associated listings and reviews
var deleteById = function(req,res){
  var userId = req.params.id;
  User.findByIdAndRemove(userId, function(err, user){
    if (!err){
      res.send(userId + "deleted.");
    }else{
      res.status(404);
    }
  });
};

// update user by id
// TODO: Check functionality
var updateById = function(req,res){
  var userId = req.params.id;
  var updatedFields = req.body;
  User.findByIdAndUpdate(userId, req.body, function(err, user){
    if (!err){
      res.send(userId + "updated.");
    }else{
      res.status(404);
    }
  });
};

// get user by email
var getByEmail = function(req,res){
  var userEmail = req.params.email;
  User.find({email:userEmail}, function(err,user){
    if(!err){
      res.send(user);
    }else{
      res.sendStatus(404);
    }
  });
};

module.exports.getAll = getAll;
module.exports.getById = getById;
module.exports.create = create;
module.exports.deleteById = deleteById;
module.exports.updateById = updateById;

module.exports.getByEmail = getByEmail;
