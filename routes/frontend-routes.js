const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

const userCont = require('../controllers/user-controller.js');

const { body } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// home page
router.get(['/', '/home'], function(req,res){
  res.render('home');
});

// map page
router.get('/map', function(req,res) {
  res.render('map');
});

// about page
router.get('/about', function(req,res) {
  res.render('about');
});

// listing page
router.get('/view-listing', function(req,res) {
  res.render('view-listing');
});

// sign-up page
router.get('/sign-up', function(req,res) {
  res.render('sign-up');
});

// login page
router.get('/login', function(req,res) {
  res.render('login');
});

// login authentication
router.post('/login', [
  // sanitise input
  body('email').isEmail().normalizeEmail()
],userCont.login);

// logout page
router.get('/logout', userCont.logout);

// user dashboard page (required authentication)
router.get('/my-listings', ensureAuthenticated, function(req, res) {
  res.render('dashboard/dash-listings');
});

router.get('/my-reviews', ensureAuthenticated, function(req, res) {
  res.render('dashboard/dash-reviews');
});

router.get('/dash-reviews', ensureAuthenticated, function(req, res) {
  res.render('dashboard/dash-reviews');
});

// user profile
router.get('/profile', function(req,res) {
    res.render('profile');
});

// render 404 page
router.get('/error', function(req,res){
  res.render('404');
});

// get logged in user data
router.get('/user/data', function(req, res) {

  if (req.user === undefined) {
    // The user is not logged in
    res.redirect('/login');
  } else {
    res.send(req.user);
  }
});

module.exports = router;
