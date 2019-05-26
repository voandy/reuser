const listingURL = "/listing";
const userURL = "user/data";

const averageRating = document.getElementById('average-rating');
const dateJoined = document.getElementById('date-joined');
const myListings = document.getElementById('my-listings');
const myReviews = document.getElementById('my-reviews');
const mainFrame = document.getElementById('main-frame');

var user;

function getUser(){
  return new Promise(resolve => {
      jQuery.get(userURL, function(data){
        user = data;
        resolve();
      });
  });
}

getUser().then(function(){
  var joinedDate = new Date(user.dateJoined);
  dateJoined.innerHTML = "<div class=\"date\">Joined: " +
    joinedDate.toLocaleDateString("en-AU", {year:"numeric", month:"short"}) + "</div>";

  averageRating.innerHTML =
    "<img class=\"user-rating\" src=\"" + getStars(user.starRatingAvg) + "\">";
});

function openListings(){
  myListings.innerHTML = "<b>My Listings</b>";
  myReviews.innerHTML = "My Reviews";
  mainFrame.innerHTML = "<iframe src=\"dash-listings\" style=\"border:none;\"></iframe>"
}

function openReviews(){
  myListings.innerHTML = "My Listings";
  myReviews.innerHTML = "<b>My Reviews</b>";
  mainFrame.innerHTML = "<iframe src=\"dash-reviews\" style=\"border:none;\"></iframe>"
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
