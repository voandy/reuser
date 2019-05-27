const createListingURL = "/listing/id/";
const uploadImageURL = "/listing/image/id/";
const viewListingURL = "/view-listing?id=";

var createListing = document.getElementById("create-listing");
var listSubmit = document.getElementById("list-submit");
var place;

createListing.addEventListener('submit', function(){
  event.preventDefault();

  var userId = user._id;

  var listTitle = document.getElementById("list-title").value;
  var listCategory = document.getElementById("list-category").value;
  var listDescription = document.getElementById("list-description").value;
  var listDate = document.getElementById("list-date").value;
  var listImage = document.getElementById("list-image").value;

  var formattedAddress = place.formatted_address;
  var longitude = place.geometry.location.lng();
  var latitude = place.geometry.location.lat();

  // create the listing
  $.ajax({
    type: "POST",
    url: createListingURL + userId,
    data: {
      title: listTitle,
      description: listDescription,
      dateExpires: listDate,
      formattedAddress: formattedAddress,
      category: listCategory,
      longitude: longitude,
      latitude: latitude
    },
    error: function (jXHR, textStatus, errorThrown) {
      alert(errorThrown);
    },
    success: function(listing){
      if (listImage) {
        // upload an image if one is attached
        listSubmit.value = 'Uploading...';

        var formData = new FormData();
        formData.append('image',  $('#list-image')[0].files[0]);

        $.ajax({
              url: uploadImageURL + listing._id,
              type: 'PUT',
              data: formData,
              success:function(data){
                  listSubmit.value = 'Done!';
                  window.open(viewListingURL + listing._id, "_self");
              },
              cache: false,
              contentType: false,
              processData: false
          });
      } else {
        listSubmit.value = 'Done!';
        window.open(viewListingURL + listing._id, "_self");
      }
    }
  });
});

var input = document.getElementById('list-address');

// autocomplete select first option on enter
// https://stackoverflow.com/questions/14601655/google-places-autocomplete-pick-first-result-on-enter-key/21101771
var selectFirstOnEnter = function(input){
  var _addEventListener = (input.addEventListener) ? input.addEventListener : input.attachEvent;

  function addEventListenerWrapper(type, listener) {
    if (type == "keydown") {
      var orig_listener = listener;
      listener = function (event) {
        var suggestion_selected = $(".pac-item-selected").length > 0;

        if (event.which == 13 && !suggestion_selected) {
          var simulated_downarrow = $.Event("keydown", {keyCode:40, which:40});
          orig_listener.apply(input, [simulated_downarrow]);
        }
        orig_listener.apply(input, [event]);
      };
    }
    _addEventListener.apply(input, [type, listener]);
  }
  if (input.addEventListener){
    input.addEventListener = addEventListenerWrapper;
  } else if (input.attachEvent) {
    input.attachEvent = addEventListenerWrapper;
  }
}

// validate and geocode address storing result into var place
function initMap(){
  var autocomplete = autocomplete = new google.maps.places.Autocomplete(input, {
    fields: ["name", "geometry.location", "place_id", "formatted_address"]
  });

  selectFirstOnEnter(input);

  // bias search to current location if available else Melbourne
  var currPos;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      currPos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
    });
  }
  var circle = new google.maps.Circle({
    center: (currPos ? currPos : {lat: -37.798535, lng: 144.960605}),
    radius: 10000
  });
  autocomplete.setBounds(circle.getBounds());

  autocomplete.addListener('place_changed', function() {
    place = autocomplete.getPlace();
  });
}
