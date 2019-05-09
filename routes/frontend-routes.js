const express = require('express');
const router = express.Router();
const {ensureAuthenticated } = require('../config/auth');

const userCont = require('../controllers/user-controller.js');

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

router.get('/login', function(req,res) {
  res.render('login');
});

// login
router.post('/login', userCont.login);

router.get('/logout', userCont.logout);

router.get('/dashboard', ensureAuthenticated, function(req, res) {
  res.render('dashboard', { name: req.user.name });
})

// listing page
router.get('/view-listing', function(req,res) {
  res.render('view-listing');
});

module.exports = router;
