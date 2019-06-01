const listingURL = "/listing";
const thisUserURL = "user/data";

const averageRating = document.getElementById('average-rating');
const dateJoined = document.getElementById('date-joined');
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
  dateJoined.innerHTML = "<div class=\"date\">Joined: " +
    joinedDate.toLocaleDateString("en-AU", {year:"numeric", month:"short"}) + "</div>";

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
