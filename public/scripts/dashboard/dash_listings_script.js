const activeListings = document.getElementsByClassName('active-listings');
const archivedListings = document.getElementsByClassName('archived-listings');

const viewListingURL ="/view-listing"
const img300URL = "http://reuser-api.s3-website-ap-southeast-1.amazonaws.com/300xAUTO/";

const activeListingsContainer = document.getElementById('active-listings-container');
const archivedListingsContainer = document.getElementById('archived-listings-container');

const activeSubtabText = document.getElementById('active-listings-button');
const archivedSubtabText = document.getElementById('archived-listings-button');

var user;
var listings;


activeSubtabText.onclick = function() { 
    showActiveListings();
    hideArchivedListings();
};

archivedSubtabText.onclick = function() { 
    hideActiveListings();
    showArchivedListings();
};

getUser().then(function(){
    // get all listings made by user
    getListings(user._id).then(function(){

        var active_listings_content = '';
        var archived_listings_content = '';
        var active_count = 0;
        var archived_count = 0;

        listings.forEach(function(listing){
            if (listing.isActive) {
                active_listings_content += '<div class="active-listings">';
                active_listings_content += renderListing(listing);
                active_listings_content += '</div>';
                active_count ++;
            } else {
                archived_listings_content += '<div class="archived-listings">';
                archived_listings_content += renderListing(listing);
                archived_listings_content += '</div>';
                archived_count ++;
            }
        });

        if (active_count > 0) {
            activeListingsContainer.innerHTML = active_listings_content;
        } else {
            activeListingsContainer.innerHTML = "<p>No active listings.</p>";
        }
        if (archived_count > 0) {
            archivedListingsContainer.innerHTML = archived_listings_content;
        } else {
            archivedListingsContainer.innerHTML = "<p>No archived listings.</p>";
        };
    });
});


// writes the html for a single listing
function renderListing(listing) {
    // store all the html code
    var listing_content = '';   
    // preprocess all the required info
    var postedDate = new Date(listing.datePosted);
    var thisListingURL = viewListingURL + "?id=" + listing._id;
    
    // Main listing container
    listing_content += '<div class="listing-container">';

    // container for lising image
    listing_content += '<div class="listing-img">' +
                            '<a href="' + thisListingURL + '">';
    if (listing.imageURLs.length != 0){
        listing_content +=     '<img src="' + img300URL + listing.imageURLs[0] + '" class="listing-img">';
    } else {
        listing_content +=     '<img src="images/listing/listing-no-pic.png" class="listing-img">';
    }
    listing_content +=     '</a>'+
                        '</div>';
  
    // listing content
    listing_content += '<div class="listing-details">' +
                            '<div class="listing-header">'  +
                                '<h6 class="title">' + 
                                    '<a href="' + thisListingURL + '">' + listing.title + '</a>' +
                                '</h6>' +
                                '<p class="date-posted">' + 'Posted: ' + postedDate.toLocaleDateString("en-AU", {year:"numeric", month:"short", day:"numeric"}) + '</p>' +
                            '</div>' +
                            '<p class="category">' + 'Category: ' + listing.category + '</p>' +
                            '<p class="description">'+ listing.description + '</p>' +
                            '<div class="actions">' +
                                '<form>' +
                                    '<button>' +
                                        '<img src="images/dash/delete-button.png">' +
                                    '</button>' +
                                '</form>' +
                                '<form>' +
                                    '<button>' +
                                        '<img src="images/dash/edit-button.png">' +
                                    '</button>' +
                                '</form>' +
                            '</div>' +
                        '</div>';

    // closing tag for the main container
    listing_content += '</div>';  

    return listing_content;                             
  }

  // returns all listings made by a user
  function getListings(userId){
      return new Promise(resolve => {
          jQuery.get(listingURL + "/userId/" + user._id, function(data){
            listings = data;
            resolve();
          });
      });
  }

function hideActiveListings() {
    for (var i = 0; i < activeListings.length; i++) {
        activeListings[i].style.display = 'none';
    }
    activeSubtabText.style.color = 'black';
}

function showActiveListings() {
    for (var i = 0; i < activeListings.length; i++) {
        activeListings[i].style.display = 'block';
    }
    activeSubtabText.style.color = '#3CB16B';
}

function hideArchivedListings() {
    for (var i = 0; i < archivedListings.length; i++) {
        archivedListings[i].style.display = 'none';
    }
    archivedSubtabText.style.color = 'black';
}

function showArchivedListings() {
    for (var i = 0; i < archivedListings.length; i++) {
        archivedListings[i].style.display = 'block';
    }
    archivedSubtabText.style.color = '#3CB16B';
}