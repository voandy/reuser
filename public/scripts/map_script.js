const listingURI = "http://127.0.0.1:7900/listing/";
const listingLink = "../mock-listing/listing.html?";

const sidebarLimit = 10;
const listingsList = document.getElementById('listings-list');

var map;
var infowindow;
var listings;

// create a new google map
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    // centre on unimelb by default
    center: {lat: -37.798535, lng: 144.960605},
    zoom: 15,
    styles: mapstyle,

    // place google map controls
    mapTypeControl: false,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.TOP_CENTER
    },
    zoomControlOptions: {
      position: google.maps.ControlPosition.LEFT_BOTTOM
    },
    streetViewControlOptions: {
      position: google.maps.ControlPosition.LEFT_BOTTOM
    },
    fullscreenControlOptions: {
      position: google.maps.ControlPosition.LEFT_TOP
    }
  });

  infowindow = new google.maps.InfoWindow();

  // center map on current location if available
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      map.setCenter(pos);
    });
  }

  // add google autocompleter to search-box
  var input = document.getElementById('search-box');
  var autocomplete = new google.maps.places.Autocomplete(input);

  // listen for search-box input to recenter map
  autocomplete.addListener('place_changed', function() {
    var place = autocomplete.getPlace();
    map.setZoom(15);
    map.setCenter(place.geometry.location);
  });
}

// retreuve all listings from backend
function getListings(){
  return new Promise(resolve => {
    jQuery.get(listingURI, function(data){
      listings = data;
      resolve();
    });
  });
}

// place listings on map
function placeListings(){
  for(var i=0; i<listings.length; i++){

    var content =
    '<a href=' + listingLink + listings[i]._id + '>' +
    '<h3>' + listings[i].title + '</h3>' + '</a>' +
    '<p>' + listings[i].description + '</p>';

    // add expiry date if one exists
    if (listings[i].dateExpires){
      var expiry = new Date(listings[i].dateExpires);
      content += '<i> Expires: ' + expiry.toLocaleDateString('en-AU');
    }

    // create marker
    var marker = new google.maps.Marker({
      position: {lat: listings[i].latitude, lng: listings[i].longitude},
      map: map,
      title: listings[i].title,
      content: content,
      icon: {
        url: 'green-dot.png'
      }
    });

    // add marker and content to listing object
    listings[i].marker = marker;

    // add InfoWindow to marker
    google.maps.event.addListener(marker, 'click', function () {
      infowindow.setContent(this.content);
      infowindow.open(map, this);
    });

    // place marker on map
    marker.setMap(map);
  }
}


getListings().then(function(){
  placeListings();
  reloadSidebar();

    // re-sort listings whenever the centre has changed
    map.addListener('idle', function() {
      reloadSidebar();
      document.getElementById('sidebar').scrollTop = 0;
    });
  }
);

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
    content += "<div class='listing' id=list-" + i + ">"  +
    "<h4 class='list-title'>" + listings[i].title  + '</h4>' +
    '<p>' + listings[i].description + '</p>' +
    '<i>' + listings[i].category  + '</i>' +
    "</div>";
  }

  listingsList.innerHTML = content;

  var listingBoxes = document.getElementsByClassName('listing');

  // add event listener for each div that opens the linked marker
  for (var i = 0; i < listingBoxes.length; i++) {
    listingBoxes[i].addEventListener('click', (function(i) {
      return function() {
        infowindow.setContent(listings[i].marker.content);
        map.setZoom(15);
        infowindow.open(map, listings[i].marker);
      }
    })(i))
  }
}

function reloadSidebar(){
  updateDist(map.getCenter());
  listings.sort((a, b) => parseFloat(a.dist) - parseFloat(b.dist));
  loadSidebar();
}

var mapstyle =
[
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ebe3cd"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#523735"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f1e6"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#c9b2a6"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#dcd2be"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#ae9e90"
      }
    ]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#93817c"
      }
    ]
  },
  {
    "featureType": "poi.business",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#a5b076"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#447530"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f1e6"
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
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#fdfcf8"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f8c967"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#e9bc62"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e98d58"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#db8555"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#806b63"
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
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8f7d77"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#ebe3cd"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "simplified"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#b9d3c2"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#92998d"
      }
    ]
  }
];
