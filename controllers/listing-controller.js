const mongoose = require('mongoose');
const Listing = mongoose.model('listing');
const faker = require('faker');

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
var create = function(req,res){
  var listing = new Listing({
    title:req.body.title,
    datePosted: new Date(),
    dateExpires:req.body.dateExpires,

    address: {
      addressLine1:req.body.addressLine1,
      addressLine2:req.body.addressLine2,
      suburb:req.body.suburb,
      state:req.body.state,
      postcode:req.body.postcode,
    },

    longitude:0,
    latitude:0,

    category:req.body.category,

    minVisibility:req.body.minVisibility,

    thanksRecId:[],

    isActive:1
  });
  listing.save(function(err,newListing){
    if(!err){
      res.send(newListing);
    }else{
      res.status(400).send(err);
    }
  })
};

// adds random listings
var addRandom = function(req,res){
  var numListings = req.params.n;
  var categories = Object.values(Listing.Categories);

  for(var i=0; i<numListings; i++){
    var listing = new Listing({
      title:faker.lorem.words(),
      datePosted: new Date(),
      dateExpires:faker.date.future(),

      address:{
        addressLine1:faker.address.streetAddress(),
        suburb:faker.address.city(),
        state:"VIC",
        postcode:Math.floor(Math.random() * (3999 - 3000)) + 3000,
      },

      longitude:(Math.random() * (37.820528 - 37.765455) + 37.765455) * -1,
      latitude:Math.random() * (145.020131 - 144.882132) + 144.882132,

      category:categories[Math.floor(Math.random()*categories.length)],

      minVisibility:0,

      thanksRecId:[],

      isActive:1
    });
    listing.save(function(err,newListing){
      if(err){
        res.status(400).send(err);
      }
    });
  }
  res.send("Added " + numListings + " listings.");
}

// delete listing by id
var deleteById = function(req,res){
  var listingId = req.params.id;
  Listing.findByIdAndDelete(listingId, function(err, listing){
    if (!err){
      res.send(listingId + " deleted.");
    }else{
      res.status(404);
    }
  });
};

// update listing by id
var updateById = function(req,res){
  var listingId = req.params.id;
  var updatedFields = req.body;
  Listing.findByIdAndUpdate(listingId, req.body, function(err, listing){
    if (!err){
      res.send(listingId + " updated.");
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
module.exports.addRandom = addRandom;
