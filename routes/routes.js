const express = require('express');
const router = express.Router();

const userCont = require('../controllers/user-controller.js');
const listingCont = require('../controllers/listing-controller.js');
const reviewCont = require('../controllers/review-controller.js');

/* USER ROUTS */

// get all users
router.get('/user', userCont.getAll);
// get user by id
router.get('/user/id/:id', userCont.getById);
// create user
router.post('/user', userCont.create);
// delete user by id
router.delete('/user/id/:id', userCont.deleteById);
// update user by id
router.put('/user/id/:id', userCont.updateById);
// get user by email
router.get('/user/email/:email', userCont.getByEmail);
// add random users
router.post('/user/n/:n', userCont.addRandom);


/* LISTING ROUTS */

// get all listings
router.get('/listing', listingCont.getAll);
// get listing by id
router.get('/listing/id/:id', listingCont.getById);
// create listing
router.post('/listing', listingCont.create);
// delete listing by id
router.delete('/listing/id/:id/:user', listingCont.deleteById);
// update listing by id
router.put('/listing/id/:id', listingCont.updateById);
// get listings filtered by location, category or search term
router.get('/listing', listingCont.filterListings);
// add random listings
router.post('/listing/n/:n', listingCont.addRandom);


/* REVIEW ROUTS */

// get all reviews
router.get('/review', reviewCont.getAll);
// get review by id
router.get('/review/id/:id', reviewCont.getById);
// create review
router.post('/review', reviewCont.create);
// delete review by id
router.delete('/review/id/:id/:user', reviewCont.deleteById);
// update review
router.put('/review/id/:id', reviewCont.updateById);
// add random reviews
router.post('/review/n/:n', reviewCont.addRandom);


module.exports = router;
