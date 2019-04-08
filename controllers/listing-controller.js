const mongoose = require('mongoose');
const Listing = mongoose.model('listing');
const NodeGeocoder = require('node-geocoder');

const geocoder = NodeGeocoder({
  provider: 'google',
  httpAdapter: 'https',
  apiKey: 'AIzaSyAfb9qNOsOS_Q77Z94lgwCdYUj4BdKShAA',
  formatter: null
});

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
var create = async (req,res) => {
  var address = req.body.addressLine1 + " " +
                ((req.body.addressLine2 != null) ? req.body.addressLine2 : "") + ", " +
                req.body.suburb + " " +
                req.body.state + " " +
                req.body.postcode;

  var listing, latitude, longitude;

  // geocode concatenated address
  await geocoder.geocode(address, function(err, res){
    if (!err){
      latitude = res[0].latitude;
      longitude = res[0].longitude;
    }else{
      res.status(400).send(err);
    }
  });

  // create the listing
  listing = new Listing({
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

    latitude:latitude,
    longitude:longitude,

    category:req.body.category,

    minVisibility:req.body.minVisibility,

    thanksRecId:[],

    isActive:1
  });

  // send it to database
  listing.save(function(err,newListing){
    if(!err){
      res.send(newListing);
    }else{
      res.status(400).send(err);
    }
  });
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
