const listingURL = "/listing";
const viewListingURL ="/view-listing"
const userURL = "/user";

const img60URL = "http://reuser-api.s3-website-ap-southeast-1.amazonaws.com/60x60/";
const img300URL = "http://reuser-api.s3-website-ap-southeast-1.amazonaws.com/300xAUTO/";

var currPos =
  (window.location.search ? getJsonFromUrl(window.location.search) : null);

const sidebarLimit = 10;
const listingsList = document.getElementById('listings-list');

var map;
var infowindow;
var listings;

initPage();

// create a new google map
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    // centre on unimelb by default
    center: {lat: -37.798535, lng: 144.960605},
    zoom: 15,
    styles: mapstyle,
    // scroll the map with one finger on touch based platforms
    gestureHandling: 'greedy',

    // place google map controls
    mapTypeControl: false,
    fullscreenControl: false,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.TOP_CENTER
    },
    zoomControlOptions: {
      position: google.maps.ControlPosition.LEFT_BOTTOM
    },
    streetViewControlOptions: {
      position: google.maps.ControlPosition.LEFT_BOTTOM
    }
  });

  infowindow = new google.maps.InfoWindow();

  // center on searched location if available
  if (currPos) {
    map.setCenter(currPos);
  }

  // add google autocompleter to search-box
  var input = document.getElementById('search-box');
  var autocomplete = autocomplete = new google.maps.places.Autocomplete(input, {
    fields: ["name", "geometry.location", "place_id", "formatted_address"]
  });

  // circle in which to bias location searches
  var circle = new google.maps.Circle({
    center: (currPos ? currPos : map.getCenter()),
    radius: 10000
  });
  autocomplete.setBounds(circle.getBounds());

  // listen for search-box input to recenter map
  autocomplete.addListener('place_changed', function() {
    var place = autocomplete.getPlace();
    map.setZoom(15);
    map.setCenter(place.geometry.location);
  });
}


function initPage(){
  getListings().then(function(){
    getUsers().then(function(){
      placeListings();
      reloadSidebar();

      // re-sort listings whenever the centre has changed
      map.addListener('idle', function() {
        reloadSidebar();
        document.getElementById('sidebar').scrollTop = 0;
      });
    });
  });
}

// retrieve all listings from backend
function getListings(){
  return new Promise(resolve => {
    jQuery.get(listingURL, function(data){
      listings = data;
      resolve();
    });
  });
}

// given a listing, will get the associated user and add to that listing
function getUser(listing){
  return new Promise(resolve => {
    jQuery.get(userURL + "/id/" + listing.userId, function(user) {
      resolve(listing.user = user);
    });
  });
}

// add associated user to all listings
async function getUsers(){
  const promises = listings.map(getUser);
  await Promise.all(promises);
}

// place listings on map
function placeListings(){
  for(var i=0; i<listings.length; i++){

    var content = "<div class='info-window'><table><tbody><tr>";

    // add image if one exists
    if (listings[i].imageURLs.length != 0) {
      content += "<td><img class=\"info-pic\" src=\"" +
      img300URL + listings[i].imageURLs[0] + "\"></td>"
    }

    content +=
    "<td><div class=\"info-description\">" +
      "<p><table><tbody><tr>" +
        "<td><a href=\"" + viewListingURL + "?id=" + listings[i]._id + "\">" +
        "<h5 class=\"info-title\">" + listings[i].title + "</h5></a></td>" +
        "<td><img src=\"/images/map/new-window.png\" class=\"nw-icon\"></td>" +
      "</tr></tbody></table></p>" +
      "<p>" + listings[i].description + "</p>";

    // add expiry date if one exists
    if (listings[i].dateExpires){
      var expiry = new Date(listings[i].dateExpires);
      content += "<i class=\"exipiry-date\"> Expires: " +
      expiry.toLocaleDateString("en-AU", {year:"numeric", month:"short", day:"numeric"}) +
      "</i>";
    }

    content += "<td></tr></tbody></table></div></div>";

    // create marker
    var marker = new google.maps.Marker({
      position: {lat: listings[i].latitude, lng: listings[i].longitude},
      map: map,
      title: listings[i].title,
      content: content,
      icon: {
        url: "/images/map/green-dot.png"
      }
    });

    // add marker and content to listing object
    listings[i].marker = marker;

    // add InfoWindow to marker
    google.maps.event.addListener(marker, "click", function () {
      infowindow.setContent(this.content);
      infowindow.open(map, this);
    });

    // place marker on map
    marker.setMap(map);
  }
}

// update distance of listings from center of map
function updateDist(latLng){
    for(var i=0; i<listings.length; i++){
      listings[i].dist = euclidianDist(
        listings[i].longitude, listings[i].latitude,
        latLng.lng(), latLng.lat()
      );
    }
}

// straight line dist between two points
function euclidianDist(x1, y1, x2, y2){
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

function loadSidebar (){
  noListings = Math.min(listings.length, sidebarLimit);
  var content = "";

  // setup divs for sidebar
  for (var i=0; i<noListings; i++){
    content +=
    "<div class=\"listing\" id=list-" + i + ">"  +
      "<h5 class=\"list-title\">" + listings[i].title  + "</h5>" +
      "<i class=\"category\">" + listings[i].category  + "</i>";

    // add image if one exists
    if (listings[i].imageURLs.length != 0) {
      content += "<div class=\"sidebar-crop\"><img class=\"sidebar-pic\" src=\"" +
      img300URL + listings[i].imageURLs[0] + "\"></div>"
    }

    // add user
    content +=
    "<div><table><tbody><tr>" +
      "<td><div class=\"profile-cropper\">" +
        "<img class=\"profile-pic\" src=\"" +
        // add profile pic if one exists
        ((listings[i].user.profilePicURL) ? img60URL + listings[i].user.profilePicURL : "images/profile/avatar-sm.png") +
        "\">" +
      "</div></td>" +
      "<td><p class=\"user-box\">" + listings[i].user.name + "<br>" +
      "<i class=\"time-since\">" + timeSince(new Date(listings[i].datePosted)) + "</i></p>"+
      "</td>" +
    "</tr></tbody></table></div>";

    content +=
    "</div>";
  }

  listingsList.innerHTML = content;

  var listingBoxes = document.getElementsByClassName("listing");

  // add event listener for each div that opens the linked marker
  for (var i = 0; i < listingBoxes.length; i++) {
    listingBoxes[i].addEventListener("click", (function(i) {
      return function() {
        infowindow.setContent(listings[i].marker.content);
        map.setZoom(15);
        infowindow.open(map, listings[i].marker);
      }
    })(i))
  }
}

// re-sorts listings by proximity to map centre and reloads sidebar
function reloadSidebar(){
  updateDist(map.getCenter());
  listings.sort((a, b) => parseFloat(a.dist) - parseFloat(b.dist));
  loadSidebar();
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

// from stackoverflow.com credit: Jan Turoň
function getJsonFromUrl(url) {
  var query = url.substr(1);
  var result = {};
  query.split("&").forEach(function(part) {
    var item = part.split("=");
    result[item[0]] = parseFloat(decodeURIComponent(item[1]), 10);
  });
  return result;
}

var mapstyle =
[
  {
    "featureType": "poi.business",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  }
];
