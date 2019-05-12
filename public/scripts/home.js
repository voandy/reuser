function initMap(){
  var input = document.getElementById('location-search');

  var autocomplete = autocomplete = new google.maps.places.Autocomplete(input, {
    fields: ["name", "geometry.location", "place_id", "formatted_address"]
  });

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
