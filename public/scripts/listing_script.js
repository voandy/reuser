const listingURL = "/listing";
const userURL = "/user";
const reviewURL = "/review";
const profileURL = "/profile";

const listingId = window.location.search.split("id=")[1];

// listing elements
const title = document.getElementById('title');
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
const reviewsRec = document.getElementById("reviews-rec");

var listing;
var user;
var reviews;
var concAddress;

getListing(listingId).then(function(){
  // get listing data
  concAddress =
    listing.address.addressLine1 +
    ((listing.addressLine2 != null) ? "<br>" + listing.address.addressLine2 : "") + "<br>" +
    listing.address.suburb + " " +
    listing.address.state + " " +
    listing.address.postcode;

  title.innerText = listing.title;
  description.innerText = listing.description;
  address.innerHTML = concAddress;

  var postedDate = new Date(listing.datePosted);
  datePosted.innerHTML = "<div class=\"date\">Posted: " +
    postedDate.toLocaleDateString("en-AU", {year:"numeric", month:"short",
    day:"numeric"}) + " in <i class=\"category\">" + listing.category + "</i></div>";

  if (listing.dateExpires) {
    var expiryDate = new Date(listing.dateExpires);
    dateExpires.innerHTML = "<div class=\"date\">Expires: " +
      expiryDate.toLocaleDateString("en-AU", {year:"numeric", month:"short",
      day:"numeric"}) + "</div>";
  }

  if (listing.imageURLs.length != 0){
    images.innerHTML = "<img src=\"" + listing.imageURLs[0] + "\" class=\"listing-pic\"></div>";
  }

  // get user data of listing's poster
  getUser(listing.userId).then(function(){
    fullName.innerHTML = "<p class=\"user-name\"><a href=\"" + profileURL + "?id=" +
    listing.userId + "\">" + user.fullName + "</a></p>";

    var joinedDate = new Date(user.dateJoined);
    dateJoined.innerHTML = "<div class=\"date\">Joined: " +
      joinedDate.toLocaleDateString("en-AU", {year:"numeric", month:"short"}) + "</div>";

    averageRating.innerHTML =
      "<img class=\"user-rating\" src=\"" + getStars(user.starRatingAvg) + "\">";

    if (user.profilePicURL){
      userPic.innerHTML = "<div class=\"profile-cropper\">" +
      "<img src=\"" + user.profilePicURL + "\" class=\"profile-pic\"></div>";
    } else {
      userPic.innerHTML = "<div class=\"profile-cropper\">" +
      "<img src=\"images/profile/avatar-sm.png\" class=\"profile-pic\"></div>";
    }

    // add email link to button
    contactButton.addEventListener("click", function(){
      window.location.href = "mailto:" + user.email;
    });

    getReviews(listing.userId).then(function(){
      if (reviews === undefined || reviews.length == 0) {
        console.log("empty");
      } else {
        getReviewers().then(function(){
          var reviews_content = "";

          // gets the first 5 reviews left for this user
          reviews.slice(0, 5).forEach(function(review){
            var reviewDate = new Date(review.datePosted);

            reviews_content +=
            "<div class=review>" +
              "<h6 class=\"review-title\">" + review.title + "</h6>" +
              "<img class=\"star-rating\" src=\"" + getStars(review.starRating) + "\">" +
              "<div class=\"left-by\">Left by: <a href=\"" + profileURL + "?id=" + review.reviewer._id + "\">" +
              review.reviewer.fullName + "</a></div>" +
              "<div class=\"date\">" +
              reviewDate.toLocaleDateString("en-AU", {year:"numeric", month:"short", day:"numeric"}) + "</div>" +
              "<div class=\"review-content\">" + review.content + "</div>" +
            "</div>";
          });
          reviewsRec.innerHTML = reviews_content;
        });
      }
    });
  });
});

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
  switch(true) {
    case (starCount<1):
      return "images/review/stars/0.png";
    case (starCount<1.25):
      return "images/review/stars/1.png";
    case (starCount<1.75):
      return "images/review/stars/1h.png";
    case (starCount<2.25):
      return "images/review/stars/2.png";
    case (starCount<2.75):
      return "images/review/stars/2h.png";
    case (starCount<3.25):
      return "images/review/stars/3.png";
    case (starCount<3.75):
      return "images/review/stars/3h.png";
    case (starCount<4.25):
      return "images/review/stars/4.png";
    case (starCount<4.75):
      return "images/review/stars/4h.png";
    default:
      return "images/review/stars/5.png";
  }
}

// credit: Sky Sanders stackoverflow.com
function timeSince(date) {
  var seconds = Math.floor((new Date() - date) / 1000);
  var interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return interval + " years ago";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + " months ago";
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + " days ago";
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + " hours ago";
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + " minutes ago";
  }
  return "Just now";
}
