const viewListingURL ="/view-listing"

const img300URL = "http://reuser-api.s3-website-ap-southeast-1.amazonaws.com/300xAUTO/";

const activeListings = document.getElementById('active-listings');
const archivedListings = document.getElementById('archived-listings');

var user;
var listings;

document.getElementById('active-listings-subtab').onclick = function() {
    activeListings.style.display = 'block';
    archivedListings.style.display = 'none';
    document.getElementById('active-listings-title').style.display = 'block';
    document.getElementById('archived-listings-title').style.display = 'none';
}

document.getElementById('archived-listings-subtab').onclick = function() {
    activeListings.style.display = 'none';
    archivedListings.style.display = 'block';
    document.getElementById('active-listings-title').style.display = 'none';
    document.getElementById('archived-listings-title').style.display = 'block';
}


getUser().then(function(){
  // get all listings made by user
  getListings(user._id).then(function(){
    var active_listings_content = '<table><tbody>';
    var archived_listings_content = '<table><tbody>';

    var active_count = 0;
    var archived_count = 0;

    listings.forEach(function(listing){
      if (listing.isActive) {
        active_listings_content += renderListing(listing);
        active_count ++;
      } else {
        archived_listings_content += renderListing(listing);
        archived_count ++;
      }
    });

    active_listings_content += "</tbody></table>"
    archived_listings_content += "</tbody></table>"

    if (active_count > 0) {
      activeListings.innerHTML = active_listings_content;
    } else {
      activeListings.innerHTML = "<p>No active listings.</p>";
    }

    if (archived_count > 0) {
      archivedListings.innerHTML = archived_listings_content;
    } else {
      archivedListings.innerHTML = "<p>No archived listings.</p>";
    }
  });
});

// writes the html for a single listing
function renderListing(listing) {
  listings_content = '';

  var postedDate = new Date(listing.datePosted);
  var thisListingURL = viewListingURL + "?id=" + listing._id;

  listings_content += "<tr class=listing>";

  // lising image
  listings_content += "<td>";
  if (listing.imageURLs.length != 0){
    listings_content += "<a href=\"" + thisListingURL + "\"><img src=\"" +
      img300URL + listing.imageURLs[0] + "\" class=\"listing-pic\"></a>";
  } else {
    listings_content += "<a href=\"" + thisListingURL +
      "\"><img src=\"images/listing/listing-no-pic.png\" class=\"listing-pic\"></a>";
  }
  listings_content += "</td>";

  // listing content
  listings_content += "<td class=\"listing-content\">";
  listings_content +=  "<h6 class=\"listing-title\"><a href=\"" +
    thisListingURL + "\">" + listing.title + "</a></h6>" +
    "<div class=\"date\">Posted: " +
    postedDate.toLocaleDateString("en-AU", {year:"numeric", month:"short",
    day:"numeric"}) + " in <i class=\"category\">" + listing.category + "</i></div>"
  listings_content += "<p class=\"description\">" + listing.description + "</p>"
  listings_content += "</td>";

  // delete/relist listing
  listings_content += "<td class=\"list-button\">";
  if (listing.isActive) {
    listings_content += "<img src=\"images/dash/bin.png\" class=\"bin-image\">";
  } else {
    listings_content += "<img src=\"images/dash/undo.png\" class=\"undo-image\">";
  }
  listings_content += "</td>";

  listings_content += "</tr>"

  return listings_content;
}

// returns all listings made by a user
function getListings(userId){
  return new Promise(resolve => {
      jQuery.get(listingURL + "/userId/" + user._id, function(data){
        listings = data;
        resolve();
      });
  });
}1
