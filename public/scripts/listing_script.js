const listingURL = "/listing";
const userURL = "/user";
const reviewURL = "/review";

const listingId = window.location.search.split("id=")[1];

// listing elements
const title = document.getElementById('title');
const category = document.getElementById('category');
const images = document.getElementById('images');
const datePosted = document.getElementById('date-posted');
const dateExpires = document.getElementById('date-expires');
const address = document.getElementById('address');
const description = document.getElementById('description');


// user elements
const fullName = document.getElementById('full-name');
const userPic = document.getElementById('user-pic');
const dateJoined = document.getElementById('date-joined');
const averageRating = document.getElementById('average-rating');
const contactButton = document.getElementById('contact-button');

// review element
const reviewRec = document.getElementById("reviews-rec");

var listing;
var user
var reviews
var concAddress;

function getListing(listingId){
  return new Promise(resolve => {
    jQuery.get(listingURL + "/id/" + listingId, function(data){
      listing = data;
      resolve();
    });
  });
}

function getUser(userId){
  return new Promise(resolve => {
      jQuery.get(userURL + "/id/" + userId, function(data){
        user = data;
        resolve();
      });
  });
}

// returns all review written about given user
function getReviews(userId){
  return new Promise(resolve => {
      jQuery.get(reviewURL + "/userId/" + userId, function(data){
        reviews = data;
        resolve();
      });
  });
}

// given a review, will get the reviewer and add it to that review
function getReviewer(review){
  return new Promise(resolve => {
    jQuery.get(userURL + "/id/" + review.leftById, function(user) {
      resolve(review.reviewer = user);
    });
  });
}

// add associated user to all reviews
async function getReviewers(){
  const promises = reviews.map(getReviewer);
  await Promise.all(promises);
}

function getStars(starCount){
  switch(starCount) {
    case 1:
      return "images/review/stars/1.png";
    case 2:
      return "images/review/stars/2.png";
    case 3:
      return "images/review/stars/3.png";
    case 4:
      return "images/review/stars/4.png";
    case 4:
      return "images/review/stars/5.png";
  }
}

getListing(listingId).then(function(){
  // get listing data
  concAddress =
    listing.address.addressLine1 +
    ((listing.addressLine2 != null) ? ", " + listing.address.addressLine2 : "") + ", " +
    listing.address.suburb + " " +
    listing.address.state + " " +
    listing.address.postcode;

  title.innerText = listing.title;
  description.innerText = listing.description;
  datePosted.innerText = listing.datePosted;
  dateExpires.innerText = listing.dateExpires;
  address.innerText = concAddress;
  category.innerText = listing.category;

  if (listing.imageURLs.length != 0){
    images.innerHTML = "<img src=\"" + listing.imageURLs[0] + "\" class=\"listing-pic\"></div>";
  }

  // get user data of listing's poster
  user = getUser(listing.userId).then(function(){
    fullName.innerText = user.fullName;
    dateJoined.innerText = user.dateJoined;
    averageRating.innerText = user.starRatingAvg;
    contactButton.innerHTML = "<a href=\"mailto: " +
      user.email +
      "\" class =\"button\">Contact</a>"

    if (user.profilePicURL){
      userPic.innerHTML = "<div class=\"profile-cropper\">" +
      "<img src=\"" + user.profilePicURL + "\" class=\"profile-pic\"></div>";
    }

    reviews = getReviews(listing.userId).then(function(){
      if (reviews === undefined || reviews.length == 0) {
        console.log("empty");
      } else {
        getReviewers().then(function(){
          console.log(reviews[0]);
          var reviews_content = "";

          // gets the first 10 reviews left for this user
          reviews.slice(0, 5).forEach(function(review){
            reviews_content +=
            "<div class=review>" +
              "<div class=\"review-title\">" + review.title + "</div>" +
              "<div class=\"left-by\">Left by: " + review.reviewer.fullName + "</div>" +
              "<div class=\"review-date\">on: " + review.datePosted + "</div>" +
              "<img class=\"star-rating\" src=\"" + getStars(review.starRating) + "\">" +
              "<div class=\"review-content\">" + review.content + "</div>" +
            "</div>";
          });
          reviewRec.innerHTML = reviews_content;
        });
      }
    });
  });
});
