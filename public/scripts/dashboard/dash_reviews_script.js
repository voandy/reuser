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
		// no reviews found
		if (reviews === undefined || reviews.length == 0) {
			myReviews.innerHTML = "<p>You have not received any reivews yet.</p>";
		} else {
			getReviewers().then(function(){
				// to store all reviews' html structure
				var reviews_content = "";
				// render all reviews
				reviews.forEach(function(review){
					reviews_content += renderReview(review);
				});
				// write to html
				myReviews.innerHTML = reviews_content;
			});
		}
	});

	getReviewsLeft(user._id).then(function(){
		// no reviews found
		if (reviewsLeft === undefined || reviewsLeft.length == 0) {
			leftReviews.innerHTML = "<p>You have not reviewed any other users yet.</p>";
		} else {
			getReviewees().then(function(){
				// to store all reviews' html structure
				var reviews_content = "";
				// render all reviews
				reviewsLeft.forEach(function(review){
					reviews_content += renderLeftReview(review);
				});
				// write to html
				leftReviews.innerHTML = reviews_content;
			});
		}
	});

});

function renderReview(review){
	// store all the html code
	var review_content = "";
	// preprocess all the required info
	var datePosted = new Date(review.datePosted);

	review_content += '<div class="review-container">' +
							'<h6 class="review-title">' + review.title + '</h6>' +
							'<div class="star-rating-container">' +
								'<img class="star-rating" src="' + getStars(review.starRating) + '>' +
							'</div>'	
							'<div class="left-by">' +
								'<a href="' + profileURL + '?id=' + review.reviewer._id + '>' + 'Left by: ' +review.reviewer.name + '</a>' + 
								'<a class="date-posted">' + datePosted.toLocaleDateString("en-AU", {year:"numeric", month:"short", day:"numeric"}) + '</a>' +
							'</div>' +
							'<p class="review-content">' + review.content + '</p>' +  
						'</div>';

	return review_content;
}

function renderLeftReview(review) {
	// store all the html code
	var review_content = "";
	// preprocess all the required info
	var datePosted = new Date(review.datePosted);

	review_content += '<div class="review-container">' +
							'<h6 class="review-title">' + review.title + '</h6>' +
							'<div class="star-rating-container">' +
								'<img class="star-rating" src="' + getStars(review.starRating) + "\">" +
							'</div>'	
							'<div class="left-for">' + 
								'<a href="' + profileURL + '?id=' + review.reviewee._id + '>' + 'Left for: ' + review.reviewee.name + '</a>' + 
								'<a class="date-posted">' + datePosted.toLocaleDateString("en-AU", {year:"numeric", month:"short", day:"numeric"}) + '</a>' +
							'</div>' +
							'<p class="review-content">' + review.content + '</p>' +  
						'</div>';

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
