const express = require('express');
const router = express.Router();

const userCont = require('../controllers/user-controller.js');
const listingCont = require('../controllers/listing-controller.js');
const reviewCont = require('../controllers/review-controller.js');

const faker = require('../controllers/faker/faker.js');


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
router.post('/user/n/:n', faker.addRandomUsers);
// upload a profile pic to aws s3
router.put('/user/image/id/:id', listingCont.imageUpload);


/* LISTING ROUTS */

// get all listings
router.get('/listing', listingCont.getAll);
// get listing by id
router.get('/listing/id/:id', listingCont.getById);
// create listing
router.post('/listing/id/:userId', listingCont.create);
// delete listing by id
router.delete('/listing/id/:id', listingCont.deleteById);
// update listing by id
router.put('/listing/id/:id', listingCont.updateById);
// add random listings
router.post('/listing/n/:n', faker.addRandomListings);
// get listings filtered by coords
router.post('/listing/filtered', listingCont.filteredListings);
// get all listing's images
router.get('/listing/image/id/:id', listingCont.getAllImages);
// create and upload to aws s3
router.put('/listing/image/id/:id', listingCont.imageUpload);
// delete a specific listing's image by the image URL
router.delete('/listing/image/id/:id', listingCont.deleteImageByURL);


/* REVIEW ROUTS */

// get all reviews
router.get('/review', reviewCont.getAll);
// get review by id
router.get('/review/id/:id', reviewCont.getById);
// create review
router.post('/review/id/:userId/:leftById', reviewCont.create);
// delete review by id
router.delete('/review/id/:id', reviewCont.deleteById);
// update review
router.put('/review/id/:id', reviewCont.updateById);
// add random reviews
router.post('/review/n/:n', faker.addRandomReviews);


module.exports = router;
