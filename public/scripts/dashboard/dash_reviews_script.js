const profileURL = "/profile";
const reviewURL = "/review";
const userURL = "user";

var user;
var reviews;
var reviewsLeft;

const myReviews = document.getElementById('my-reviews');
const leftReviews = document.getElementById('left-reviews');

getUser().then(function(){
  // get all reviews about user
  getReviewsFor(user._id).then(function(){
    if (reviews === undefined || reviews.length == 0) {
      myReviews.innerHTML = "<p>You have not received any reivews yet.</p>";
    } else {
      getReviewers().then(function(){
        var reviews_content = "";

        // gets the first 5 reviews left for this user
        reviews.forEach(function(review){
          reviews_content += renderReview(review);
        });

        myReviews.innerHTML = reviews_content;
      });
    }
  });

  getReviewsLeft(user._id).then(function(){
    if (reviewsLeft === undefined || reviewsLeft.length == 0) {
      leftReviews.innerHTML = "<p>You have not reviewed any other users yet.</p>";
    } else {
      getReviewees().then(function(){
        var reviews_content = '<table><tbody>';

        // gets the first 5 reviews left for this user
        reviewsLeft.forEach(function(review){
          reviews_content += renderLeftReview(review);
        });

        reviews_content += '</table></tbody>';
        leftReviews.innerHTML = reviews_content;
      });
    }
  });

});

function renderReview(review){
  review_content = "";
  var reviewDate = new Date(review.datePosted);

  review_content +=
  "<div class=\"class=review\">" +
    "<h6 class=\"review-title\">" + review.title + "</h6>" +
    "<img class=\"star-rating\" src=\"" + getStars(review.starRating) + "\">" +
    "<div class=\"left-by\">Left by: <a href=\"" + profileURL + "?id=" + review.reviewer._id + "\">" +
    review.reviewer.name + "</a></div>" +
    "<div class=\"date\">" +
    reviewDate.toLocaleDateString("en-AU", {year:"numeric", month:"short", day:"numeric"}) + "</div>" +
    "<div class=\"review-content\">" + review.content + "</div>" +
  "</div>";

  return review_content;
}

function renderLeftReview(review) {
  review_content = "";
  var reviewDate = new Date(review.datePosted);

  review_content +=
  "<tr class=\"class=review\">" +
    "<td>" +
      "<h6 class=\"review-title\">" + review.title + "</h6>" +
      "<img class=\"star-rating\" src=\"" + getStars(review.starRating) + "\">" +
      "<div class=\"left-for\">Left for: <a href=\"" + profileURL + "?id=" + review.reviewee._id + "\">" +
      review.reviewee.name + "</a></div>" +
      "<div class=\"date\">" +
      reviewDate.toLocaleDateString("en-AU", {year:"numeric", month:"short", day:"numeric"}) + "</div>" +
      "<div class=\"review-content\">" + review.content + "</div>" +
    "</td>" +
    "<td class=\"list-button\">" +
      "<img src=\"images/dash/bin.png\" class=\"bin-image\">" +
    "</td>" +
  "</tr>";

  return review_content;
}

// returns all review written about given user
function getReviewsFor(userId){
  return new Promise(resolve => {
      jQuery.get(reviewURL + "/userId/" + userId, function(data){
        reviews = data;
        resolve();
      });
  });
}

// returns all review left by a given user
function getReviewsLeft(userId){
  return new Promise(resolve => {
      jQuery.get(reviewURL + "/leftUserId/" + userId, function(data){
        reviewsLeft = data;
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

// given a review, will get the reviewee and add it to that review
function getReviewee(review){
  return new Promise(resolve => {
    jQuery.get(userURL + "/id/" + review.userId, function(user) {
      resolve(review.reviewee = user);
    });
  });
}

// add associated reviewee to all reviews
async function getReviewees(){
  const promises = reviewsLeft.map(getReviewee);
  await Promise.all(promises);
}
