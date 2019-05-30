const listingURL = "/listing";
const thisUserURL = "user/data";

const averageRating = document.getElementById('average-rating');
// const dateJoined = document.getElementById('date-joined');
const myListings = document.getElementById('my-listings');
const mainFrame = document.getElementById('main-frame');

var user;

// get the logged in user
function getUser(){
  return new Promise(resolve => {
      jQuery.get(thisUserURL, function(data){
        user = data;
        resolve();
      });
  });
}

getUser().then(function(){
  var joinedDate = new Date(user.dateJoined);
  // dateJoined.innerHTML = "<div class=\"date\">Joined: " +
  //   joinedDate.toLocaleDateString("en-AU", {year:"numeric", month:"short"}) + "</div>";

  averageRating.innerHTML =
    "<img class=\"user-rating\" src=\"" + getStars(user.starRatingAvg) + "\">";
});

// switch to the listings page
function openListings(){
  myListings.innerHTML = "<b>My Listings</b>";
  myReviews.innerHTML = "My Reviews";
  mainFrame.innerHTML = "<iframe src=\"dash-listings\" style=\"border:none;\" width=\"100%\" scrolling=\"no\" onload=\"resizeIframe(this)\"></iframe>"
}

// switch to the reviews page
function openReviews(){
  myListings.innerHTML = "My Listings";
  myReviews.innerHTML = "<b>My Reviews</b>";
  mainFrame.innerHTML = "<iframe src=\"dash-reviews\" style=\"border:none;\" width=\"100%\" scrolling=\"no\" onload=\"resizeIframe(this)\"></iframe>"
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
