const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

const userCont = require('../controllers/user-controller.js');

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
router.post('/login', userCont.login);

// logout page
router.get('/logout', userCont.logout);

// user dashboard page (required authentication)
router.get('/dashboard', ensureAuthenticated, function(req, res) {
  res.render('dashboard', { name: req.user.name });
});

// user profile
router.get('/profile', function(req,res) {
  res.render('profile');
});

module.exports = router;
