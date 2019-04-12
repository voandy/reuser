const mongoose = require('mongoose');
const faker   = require('faker');
const cryptography = require("../cryptography/cryptography.js");
var random = require('mongoose-simple-random');

const Listing = mongoose.model('listing');
const User = mongoose.model('user');
const Review = mongoose.model('review');

// adds random users
var addRandomUsers = function(req,res){
  var numUsers = req.params.n;
  var salt = cryptography.generateSalt();
  var hash = cryptography.hashPassword(faker.internet.password(), salt);

  for(var i=0; i<numUsers; i++){
    var user = new User({
      email:faker.internet.email(),
      dateJoined: new Date(),

      password:hash,
      passwordSalt:salt,

      firstName:faker.name.firstName(),
      lastName:faker.name.lastName(),

      address:{
        addressLine1:faker.address.streetAddress(),
        suburb:faker.address.city(),
        state:"VIC",
        // Random postcode in VIC
        postcode:Math.floor(Math.random() * (3999 - 3000)) + 3000,
      },

      phoneNo:faker.phone.phoneNumber(),

      thanksReceived:0,
      starRatingAvg:0,
      listingIds:[],
      reviewIds:[]
    });
    user.save(function(err,newUser){
      if(err){
        res.status(400).send(err);
      }
    });
  }
  res.send("Added " + numUsers + " users.");
};

// adds random listings
var addRandomListings = function(req,res){
  var numListings = req.params.n;
  var categories = Object.values(Listing.Categories);

  for(var i=0; i<numListings; i++){
    var listing = new Listing({
      title:faker.lorem.words(),
      description:faker.lorem.paragraph(),

      datePosted: new Date(),
      dateExpires:faker.date.future(),

      address:{
        addressLine1:faker.address.streetAddress(),
        suburb:faker.address.city(),
        state:"VIC",
        // Random postcode in VIC
        postcode:Math.floor(Math.random() * (3999 - 3000)) + 3000,
      },

      // Random coordinates in Melbourne
      longitude:(Math.random() * (37.820528 - 37.765455) + 37.765455) * -1,
      latitude:Math.random() * (145.020131 - 144.882132) + 144.882132,

      // Random category from product categories
      category:categories[Math.floor(Math.random()*categories.length)],

      minVisibility:0,

      thanksRecId:[],

      isActive:1
    });
    
    listing.save(async(err,newListing) => {
      if(!err){
        // add listingId to foreign keys of random user
        await User.findOneRandom(function(err,user){
          user.listingIds.push(newListing._id);
          user.save(function(err,newUser){
            if (err){
              res.status(400);
            }
          });
        });
      }else{
        res.status(400).send(err);
      }
    });
  }
  res.send("Added " + numListings + " listings.");
};

// adds random reviews
var addRandomReviews = function(req,res){
  var numReviews = req.params.n;

  for(var i=0; i<numReviews; i++){
    var review = new Review({
      leftById:"5ca9bc07da394e32944ad120",

      title:faker.lorem.sentence(),
      contents:faker.lorem.paragraph(),
      starRating:Math.floor(Math.random() * (5 - 1)) + 1
    });

    review.save(async(err,newReview) => {
      if(!err){
        // add reviewId to foreign keys of random user
        await User.findOneRandom(function(err,user){
          user.reviewIds.push(newReview._id);
          user.save(function(err,newUser){
            if (err){
              res.status(400);
            }
          });
        });
      }else{
        res.status(400).send(err);
      }
    });
  }
  res.send("Added " + numReviews + " reviews.");
};

module.exports.addRandomUsers = addRandomUsers;
module.exports.addRandomListings = addRandomListings;
module.exports.addRandomReviews = addRandomReviews;
