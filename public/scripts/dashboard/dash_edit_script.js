const updateUserURL = "/user/id/";
const uploadImageURL = "/user/image/id/";
const viewProfileURL = "/profile?id=";

var updateUser = document.getElementById("update-user");
var userSubmit = document.getElementById("user-submit");
var place;

updateUser.addEventListener('submit', function(){
  event.preventDefault();

  var userId = user._id;

  var userName = document.getElementById("user-name").value;
  var userEmail = document.getElementById("user-email").value;
  var userImage = document.getElementById("user-image").value;
  var userAddress = document.getElementById("user-address").value;

  var formattedAddress = place.formatted_address;

  var longitude = place.geometry.location.lng();
  var latitude = place.geometry.location.lat();

  var data = {};

  if (userName) {
    data.name = userName;
  }
  if (userEmail) {
    data.email = userEmail;
  }
  if (userAddress) {
    data.formattedAddress = formattedAddress;
  }

  // update the user
  $.ajax({
    type: "PUT",
    url: updateUserURL + userId,
    data: data,
    error: function (jXHR, textStatus, errorThrown) {
      alert(errorThrown);
    },
    success: function(user){
      if (userImage) {
        // upload an image if one is attached
        userSubmit.value = 'Uploading...';

        var formData = new FormData();
        formData.append('image',  $('#user-image')[0].files[0]);

        $.ajax({
          url: uploadImageURL + userId,
          type: 'PUT',
          data: formData,
          success:function(data){
            userSubmit.value = 'Done!';
            window.open(viewProfileURL + userId, "_self");
          },
          cache: false,
          contentType: false,
          processData: false
        });
      } else {
        userSubmit.value = 'Done!';
        window.open(viewProfileURL + userId, "_self");
      }
    }
  });
});

var input = document.getElementById('user-address');

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
