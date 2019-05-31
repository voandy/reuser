const viewListingURL ="/view-listing"

const img300URL = "http://reuser-api.s3-website-ap-southeast-1.amazonaws.com/300xAUTO/";

const activeListings = document.getElementById('active-listings');
const archivedListings = document.getElementById('archived-listings');

const archiveButtons = document.getElementsByClassName('archive-button');

var user;
var listings;

// to switch between artive and archive listings
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
  }).then(function() {
    // assign onclick functions to the buttons only when 
    // they are added to the html page
    var archiveButtons = document.querySelectorAll('.bin-image');
    for (archiveBtn of archiveButtons)  
      archiveBtn.onclick = archiveListing;

    var undoButtons = document.querySelectorAll('.undo-image');
    for (undoBtn of undoButtons)  
      undoBtn.onclick = undoArchivedListing;
  });
});

// writes the html for a single listing
function renderListing(listing) {
  listings_content = '';

  var postedDate = new Date(listing.datePosted);
  var thisListingURL = viewListingURL + "?id=" + listing._id;

  listings_content += "<tr class=listing>";
  // add a hidden cell that contains listing id for easier manipulation
  listings_content += '<td class="listing-id-hidden">' + listing._id + '</td>';
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
}

function archiveListing() {
  // get listing id
  var listingId = $(this).parent().parent().children('td.listing-id-hidden').text();
  // create body structure
  var body = JSON.stringify({
    'isActive': false
  });
  // put to server
  $.ajax({
    type: 'PUT',
    url: '/listing/id/' + listingId,
    data: body,
    contentType: 'application/json',
    error: function (jXHR, textStatus, errorThrown) {
        alert(errorThrown);
    }
  });
  window.location.reload();  
}

function undoArchivedListing() {
  // get listing id
  var listingId = $(this).parent().parent().children('td.listing-id-hidden').text();
  // create body structure
  var body = JSON.stringify({
    'isActive': true
  });
  // put to server
  $.ajax({
    type: 'PUT',
    url: '/listing/id/' + listingId,
    data: body,
    contentType: 'application/json',
    error: function (jXHR, textStatus, errorThrown) {
        alert(errorThrown);
    }
  });
  window.location.reload();  
}