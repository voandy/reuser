const mongoose = require('mongoose');
const cryptography = require("./cryptography/cryptography.js");

const User = mongoose.model('user');
const Listing = mongoose.model('listing');
const Review = mongoose.model('review');

const upload = require('../services/image-upload');
const singleUpload = upload.single('image')

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
  // var salt = cryptography.generateSalt();
  // var hash = cryptography.hashPassword(req.body.password, salt);

  var user = new User({
    email:req.body.email,
    dateJoined: new Date(),

    password:req.body.password,
    passwordSalt:"salt",

    fullName:req.body.fullName,

    address:{
      addressLine1:req.body.addressLine1,
      addressLine2:req.body.addressLine2,
      suburb:req.body.suburb,
      state:req.body.state,
      postcode:req.body.postcode,
    },

    phoneNo:req.body.phoneNo,

    thanksReceived:0,
    starRatingAvg:0,

    profilePicURL:null
  });

  user.save(function(err,newUser){
    if(!err){
      res.send(newUser);
    }else{
      res.status(400).send(err);
    }
  });
};

// delete user by id
var deleteById = function (req,res) {
  var userId = req.params.id;

  // delete associated listings and reviews
  Listing.deleteMany( {userId: userId}, function(err){
    res.status(400);
  });
  Review.deleteMany( {$or: [{userId: userId}, {leftById: userId}]}, function(err){
    res.status(400);
  });

  // delete the user
  User.findByIdAndDelete(userId, function(err, user){
    if (!err){
      res.send(userId + " deleted.");
    }else{
      res.status(404);
    }
  });
};

// update user by id
var updateById = function(req,res){
  var userId = req.params.id;
  var updatedFields = req.body;

  User.findByIdAndUpdate(userId, req.body, {runValidators:true},
    function(err, user){
    if (!err){
      res.send(userId + " updated.");
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

// upload a single image to aws s3
var imageUpload = function(req, res) {
  var userId = req.params.id;

  singleUpload(req, res, function(err, some) {
    if (err) {
      return res.status(422).send({errors: [{title: 'Image Upload Error', detail: err.message}] });
    }

    User.findByIdAndUpdate(userId, {profilePicURL: req.file.location}, function(err, user){
      if(err){
        res.sendStatus(404);
      }
    });

    return res.json({'imageUrl': req.file.location});
  });
};

module.exports.getAll = getAll;
module.exports.getById = getById;
module.exports.create = create;
module.exports.deleteById = deleteById;
module.exports.updateById = updateById;

module.exports.getByEmail = getByEmail;
module.exports.imageUpload = imageUpload;
