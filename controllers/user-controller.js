const mongoose = require('mongoose');

const User = mongoose.model('user');
const Listing = mongoose.model('listing');
const Review = mongoose.model('review');

const upload = require('../services/image-upload');
const singleUpload = upload.single('image')

const bcrypt = require('bcryptjs');
const passport = require('passport');

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

  console.log('someone tries to create user!');
  console.log(req.body);

  const { name, email, password, password_cfm } = req.body;
  let errors = []

  // check required fields
  if (!name || !email || !password || !password_cfm) {
    errors.push({ msg: 'Please fill in all the fields'});
  }

  // check password match
  if (password !== password_cfm) {
    errors.push({ msg: 'Passwords do not match'});
  }

  // check password length
  if (password.length < 8) {
    errors.push({ msg: 'Password must be at least 8 characters'});
  }

  // checks if there is issues with input values
  if (errors.length > 0) {
    res.render('sign-up', {
      errors,
      name,
      email,
      password,
      password_cfm
    });
  // pass all validations
  } else {
    User.findOne({ email: email })
      .then(user => {
        // user already exists
        if (user) {
          errors.push({ msg: "Email is already registered" });
          res.render('sign-up', {
            errors,
            name,
            email,
            password,
            password_cfm
          });
        } else {
          const newUser = new User({
            name: name,
            email: email,
            password: password,
            dateJoined: new Date(),
            thanksReceived:0,
            starRatingAvg:0,
            profilePicURL:null
          });

          bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              // set password to hash
              newUser.password = hash;
              // save user
              newUser.save()
                .then(user => {
                  res.redirect('/map');
                })
                .catch(err => console.log(err));
          }))
        }
      });
  }

  // Previous new user's parameters
  // var user = new User({
  //   name:req.body.name,
  //   email:req.body.email,
  //   password:req.body.password,
  //   dateJoined: new Date(),
  //   address:{
  //     addressLine1:req.body.addressLine1,
  //     addressLine2:req.body.addressLine2,
  //     suburb:req.body.suburb,
  //     state:req.body.state,
  //     postcode:req.body.postcode,
  //   },
  //   phoneNo:req.body.phoneNo,
  //   thanksReceived:0,
  //   starRatingAvg:0,
  //   profilePicURL:null
  // });

};

var login = function(req, res, next) {
  passport.authenticate('local', {
    successRedirect: '/profile?id=5cd5a6b2126fd93b985558e7',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
}

var logout = function(req, res) {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/login')
}

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

module.exports.login = login;
module.exports.logout = logout;
