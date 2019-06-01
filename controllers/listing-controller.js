const s3resize60URL = "http://reuser-api.s3-website-ap-southeast-1.amazonaws.com/60x60/";
const s3resize300URL = "http://reuser-api.s3-website-ap-southeast-1.amazonaws.com/300xAUTO/";
const s3resize650URL = "http://reuser-api.s3-website-ap-southeast-1.amazonaws.com/650xAUTO/";

const request = require("request");
const mongoose = require('mongoose');

const Listing = mongoose.model('listing');
const User    = mongoose.model('user');

const upload = require('../services/image-upload');
const singleUpload = upload.single('image')

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

// get active listings
var getActive = function(req,res){
  Listing.find({isActive:true}, function(err, listings){
    if (!err){
      res.send(listings);
    }else{
      res.status(404);
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
  // create the listing
  var listing = new Listing({
    userId:req.params.userId,

    title:req.body.title,
    description:req.body.description,

    datePosted: new Date(),
    dateExpires:req.body.dateExpires,

    formattedAddress: req.body.formattedAddress,

    longitude:req.body.longitude,
    latitude:req.body.latitude,

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
var filteredCoords = function(req,res){
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

      // store only the image filename, url is appended by lamda resize
      var thisURL = req.file.location.split("/");
      var filename = thisURL[thisURL.length - 1];
      imageURLs.push(filename);

      // send get requests to aws to pre-emptively resize images
      request.get(s3resize650URL + filename, (error, response, body) => {});
      request.get(s3resize300URL + filename, (error, response, body) => {});
      request.get(s3resize60URL + filename, (error, response, body) => {});

      listing.imageURLs = imageURLs;
      listing.save();

      // wait for images to resize then send res
      setTimeout(function() {
        return res.json({'imageUrl': req.file.location});
      }, 5000);
    });
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

// given a userId returns all listings made by that user
var getByUser = function(req,res){
  var userId = req.params.userId;
  Listing.find({userId:userId}, function(err, listings){
    if (!err){
      res.send(listings);
    }else{
      res.status(404);
    }
  });
}

// given a userId returns all ACTIVE listings made by that user
var getActiveByUser = function(req,res){
  var userId = req.params.userId;
  Listing.find({userId:userId, isActive:true}, function(err, listings){
    if (!err){
      res.send(listings);
    }else{
      res.status(404);
    }
  });
}

// return listings filtered by category and search term
var filteredSearch = function (req,res){
  var filter = {
    checked: req.body.checked
  };

  if (typeof req.body.searchTerm !== "undefined"){
    filter.searchTerm = req.body.searchTerm;
    Listing.find({
      $and: [
        {title:{$regex: filter.searchTerm, '$options' : 'i'}},
        {category: {$in: filter.checked}}
      ]
    }, function(err, listings){
      if (!err){
        res.send(listings);
      }else{
        res.status(404);
      }
    });
  } else {
    Listing.find({category: {$in: filter.checked}}, function(err, listings){
      if (!err){
        res.send(listings);
      }else{
        res.status(404);
      }
    });
  }
}

module.exports.getAll = getAll;
module.exports.getActive = getActive;
module.exports.getById = getById;
module.exports.create = create;
module.exports.deleteById = deleteById;
module.exports.updateById = updateById;

module.exports.filteredCoords = filteredCoords;
module.exports.imageUpload = imageUpload;
module.exports.getAllImages = getAllImages;
module.exports.deleteImageByURL = deleteImageByURL;
module.exports.getByUser = getByUser;
module.exports.getActiveByUser = getActiveByUser;
module.exports.filteredSearch = filteredSearch;
