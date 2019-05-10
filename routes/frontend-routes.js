const express = require('express');
const router = express.Router();

// home page
router.get('/', function(req,res){
  res.render('home');
});

// map page
router.get('/map', function(req,res) {
  res.render('map');
});

//
router.get('/about', function(req,res) {
  res.render('about');
});

router.get('/home', function(req,res) {
  res.render('home');
});

// sign-up page
router.get('/sign-up', function(req,res) {
  res.render('sign-up');
});

// listing page
router.get('/view-listing', function(req,res) {
  res.render('view-listing');
});

// user profile
router.get('/profile', function(req,res) {
  res.render('profile');
});

module.exports = router;
