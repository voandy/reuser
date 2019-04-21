const mongoose = require('mongoose');
const NodeGeocoder = require('node-geocoder');

const Listing = mongoose.model('listing');
const User    = mongoose.model('user');

const upload = require('../services/image-upload');
const singleUpload = upload.single('image')

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
  });
};

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
var create = function (req,res) {
  var address = req.body.addressLine1 + " " +
    ((req.body.addressLine2 != null) ? req.body.addressLine2 : "") + ", " +
    req.body.suburb + " " +
    req.body.state + " " +
    req.body.postcode;

  var listing;

  // geocode concatenated address
  function geocodeAddress() {
    return new Promise((resolve,reject) => {
      geocoder.geocode(address, function(err, res){
        if (!err){
          resolve({longitude:res[0].longitude, latitude:res[0].latitude});
        }else{
          reject();
        }
      });
    });
  }

  async function createListing(){
    // TODO: Error handling for rejected promise
    var coords = await geocodeAddress();

    // create the listing
    listing = new Listing({
      userId:req.params.userId,

      title:req.body.title,
      description:req.body.description,

      datePosted: new Date(),
      dateExpires:req.body.dateExpires,

      address: {
        addressLine1:req.body.addressLine1,
        addressLine2:req.body.addressLine2,
        suburb:req.body.suburb,
        state:req.body.state,
        postcode:req.body.postcode,
      },

      longitude:coords.longitude,
      latitude:coords.latitude,

      category:req.body.category,

      minVisibility:req.body.minVisibility,

      thanksRecId:[],

      isActive:1
    });

    // send it to database
    listing.save(function (err,newListing) {
      if(!err){
        res.send(newListing);
      }else{
        res.status(400).send(err);
      }
    });
  }
  createListing();
}

// delete listing by id
var deleteById = function(req,res){
  var listingId = req.params.id;

  // delete the Listing
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

// get listings filtered by coords
var filteredListings = function(req,res){
  var longmin = req.body.longmin;
  var longmax = req.body.longmax;
  var latmin = req.body.latmin;
  var latmax = req.body.latmax;

  var range =
  {
    longitude: {'$gte': longmin, '$lte': longmax},
    latitude: {'$gte': latmin, '$lte': latmax}
  }

  Listing.find(range, function(err,listings){
    if(!err){
      res.send(listings);
    }else{
      res.sendStatus(404);
    }
  });
};

// upload a single image to aws s3 
var imageUpload = function(req, res) {
  var listingId = req.params.id;

  singleUpload(req, res, function(err, some) {
    if (err) {
      return res.status(422).send({errors: [{title: 'Image Upload Error', detail: err.message}] });
    }
    Listing.findById(listingId, function(err, listing){
      var imageURLs = listing.imageURLs;
      imageURLs.push(req.file.location);
      listing.imageURLs = imageURLs;
      listing.save();
    });
    return res.json({'imageUrl': req.file.location});
  });
};

// return all image urls in the listing
var getAllImages = function(req, res) {
  var listingId = req.params.id;
  Listing.findById(listingId, function(err, listing) {
    return res.send(listing.imageURLs); 
  });
};

// delete a specific listing's image by the image URL
var deleteImageByURL = function(req, res) {
  var listingId = req.params.id;
  var imageURL = req.body.url;

  Listing.findById(listingId, function(err, listing) {
    var imageURLs = listing.imageURLs;
    imageURLs = imageURLs.filter(url => url != imageURL);
    listing.imageURLs = imageURLs;
    listing.save();
    return res.send(listing.imageURLs);
  });
};

module.exports.getAll = getAll;
module.exports.getById = getById;
module.exports.create = create;
module.exports.deleteById = deleteById;
module.exports.updateById = updateById;

module.exports.filteredListings = filteredListings;

module.exports.imageUpload = imageUpload;
module.exports.getAllImages = getAllImages;
module.exports.deleteImageByURL = deleteImageByURL;

