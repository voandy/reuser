const mongoose = require('mongoose');
const faker   = require('faker');
const random = require('mongoose-simple-random');
const bcrypt = require('bcryptjs');

const Listing = mongoose.model('listing');
const User = mongoose.model('user');
const Review = mongoose.model('review');

// adds random users
var addRandomUsers = function(req,res){
  var numUsers = req.params.n;

  for(var i=0; i<numUsers; i++){
    var user = new User({
      email:faker.internet.email(),
      dateJoined: new Date(),

      name:faker.name.findName(),

      password:"password",

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

      profilePicURL:null
    });

    bcrypt.genSalt(10, (err, salt) =>
      bcrypt.hash(user.email, salt, (err, hash) => {
        if (err) {
          throw err;
        } else {
          user.password = hash;
          user.save(function(err,newUser){
            if(err){
              console.log(err);
              res.status(400).send(err);
            }
          });
        }
      })
    );
  }
  res.send("Added " + numUsers + " users.");
};

// adds random listings
var addRandomListings = function(req,res){
  var numListings = req.params.n;
  var categories = Object.values(Listing.Categories);
  var listing;

  for(var i=0; i<numListings; i++){
    // get random user's id
    function getRandomUserId() {
      return new Promise(resolve => {
        User.findOneRandom(function(err,user){
          resolve(user._id.toString());
        });
      });
    }

    async function createListing(){
      // TODO: Error handling for rejected promise
      var userId = await getRandomUserId();

      listing = new Listing({
        userId:userId,

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
        longitude:Math.random() * (145.020131 - 144.882132) + 144.882132,
        latitude:(Math.random() * (37.820528 - 37.765455) + 37.765455) * -1,

        // Random category from product categories
        category:categories[Math.floor(Math.random()*categories.length)],

        minVisibility:0,

        thanksRecId:[],

        isActive:1,

        imageURLs:[]
      });

      listing.save(function(err,newListing) {
        if(err){
          res.status(400).send(err);
        }
      });
    }
    createListing();
  }
  res.send("Added " + numListings + " listings.");
};

// adds random reviews
var addRandomReviews = function(req,res){
  var numReviews = req.params.n;
  var review;

  for(var i=0; i<numReviews; i++){
    // get random user's id
    function getRandomUserId() {
      return new Promise(resolve => {
        User.findOneRandom(function(err,user){
          resolve(user._id.toString());
        });
      });
    }

    async function createReview(){
      // TODO: Error handling for rejected promise
      var userId = await getRandomUserId();
      var leftById = await getRandomUserId();

      // create a new review if allowed
      if (userId != leftById) {
        review = new Review({
          userId:userId,
          leftById:leftById,

          datePosted: new Date(),

          title:faker.lorem.sentence(),
          content:faker.lorem.paragraph(),
          starRating:Math.floor(Math.random() * (5 - 1)) + 1,

          imageURLs:[]
        });

        review.save(function(err,newReview) {
          if(err){
            res.status(400).send(err);
          }
        });

        Review.find({userId:userId}, function(err, reviews){
          var reviewCount = 0;
          var starTotal = 0;
          var starRatingAvg = 0;

          reviews.forEach(function(review) {
            reviewCount ++;
            starTotal += review.starRating;
          });
          starRatingAvg = starTotal / reviewCount;

          User.findByIdAndUpdate(userId, {starRatingAvg:starRatingAvg},
            {runValidators:true}, function(err, user) {
            if (err){
              res.status(404);
            }
          });
        });
      }
    }

    createReview();
  }

  res.send("Added " + numReviews + " reviews.");
};

module.exports.addRandomUsers = addRandomUsers;
module.exports.addRandomListings = addRandomListings;
module.exports.addRandomReviews = addRandomReviews;
