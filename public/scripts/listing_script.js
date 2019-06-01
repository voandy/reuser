const listingURL = "/listing";
const userURL = "/user";
const reviewURL = "/review";
const profileURL = "/profile";

const img60URL = "http://reuser-api.s3-website-ap-southeast-1.amazonaws.com/60x60/";
const img650URL = "http://reuser-api.s3-website-ap-southeast-1.amazonaws.com/650xAUTO/";

const listingId = window.location.search.split("id=")[1];

// listing elements
const title = document.getElementById('title');
const images = document.getElementById('images');
const datePosted = document.getElementById('date-posted');
const dateExpires = document.getElementById('date-expires');
const address = document.getElementById('address');
const description = document.getElementById('description');


// user elements
const userName = document.getElementById('full-name');
const userPic = document.getElementById('user-pic');
const dateJoined = document.getElementById('date-joined');
const averageRating = document.getElementById('average-rating');
const contact = document.getElementById('contact');

// review element
const reviewsRec = document.getElementById("reviews-rec");

var listing;
var user;
var reviews;
var map;
var infoWindow;

// place map
function initMap() {
  return new Promise(resolve => {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: -37.798535, lng: 144.960605},
      zoom: 15,
      styles: mapstyle,

      mapTypeControl: false,
      fullscreenControl: false,
    });
    resolve();
  });
}

getListing(listingId).then(function(){
  title.innerText = listing.title;
  description.innerText = listing.description;
  address.innerHTML = listing.formattedAddress;

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
    images.innerHTML = "<img src=\"" + img650URL + listing.imageURLs[0] + "\" class=\"listing-pic\"></div>";
  }

  // set map
  initMap().then(function(){
    infowindow = new google.maps.InfoWindow();
    var listingPos = {lat: listing.latitude, lng:listing.longitude};
    map.setCenter(listingPos);

    var infoContent = "<h5>" + listing.title + "</h5>" +
    "<p>" + listing.formattedAddress + "</p>";

    // create marker
    var marker = new google.maps.Marker({
      position: listingPos,
      map: map,
      title: listing.title,
      content: infoContent,
      icon: {
        url: "/images/map/red-dot.png"
      }
    });

    // add InfoWindow to marker
    google.maps.event.addListener(marker, "click", function () {
      infowindow.setContent(this.content);
      infowindow.open(map, this);
    });

    // place marker on map
    marker.setMap(map);
  });

  // get user data of listing's poster
  getUser(listing.userId).then(function(){
    userName.innerHTML = "<p class=\"user-name\"><a href=\"" + profileURL + "?id=" +
    listing.userId + "\">" + user.name + "</a></p>";

    var joinedDate = new Date(user.dateJoined);
    dateJoined.innerHTML = "<div class=\"date\">Joined: " +
      joinedDate.toLocaleDateString("en-AU", {year:"numeric", month:"short"}) + "</div>";

    averageRating.innerHTML =
      "<img class=\"user-rating\" src=\"" + getStars(user.starRatingAvg) + "\">";

    if (user.profilePicURL){
      userPic.innerHTML = "<div class=\"profile-cropper\">" +
      "<img src=\"" + img60URL + user.profilePicURL + "\" class=\"profile-pic\"></div>";
    } else {
      userPic.innerHTML = "<div class=\"profile-cropper\">" +
      "<img src=\"images/profile/avatar-sm.png\" class=\"profile-pic\"></div>";
    }

    // create contact button
    contact.innerHTML = "<button id=\"contact-button\">contact</button>";
    const contactButton = document.getElementById("contact-button");

    // add email link to button
    contactButton.addEventListener("click", function(){
      window.location.href = "mailto:" + user.email; //mailto subject
    });

    getReviews(listing.userId).then(function(){
      if (reviews === undefined || reviews.length == 0) {
        reviewsRec.innerText = "No reviews received."
      } else {
        reviews.sort(function(a,b){
          return new Date(b.datePosted) - new Date(a.datePosted);
        });
        
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
              review.reviewer.name + "</a></div>" +
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
    $.ajax({
      url: listingURL + "/id/" + listingId,
      type: 'GET',
      success: function(data){
        listing = data;
        resolve();
      },
      error: function(data) {
        window.open("/error", "_self");
      }
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
