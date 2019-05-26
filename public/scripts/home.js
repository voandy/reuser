var input = document.getElementById('location-search');

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
    var place = autocomplete.getPlace();
    latitude = place.geometry.location.lat();
    longitude = place.geometry.location.lng();
    window.open("/map?" + 'lat=' + latitude + '&lng=' + longitude, "_self");
  });
}
