function initMap(){
    // map details and options
    var options ={
        zoom:12,
        center:{lat:-37.8136, lng:144.9631}    
    }        
// the map itself
var map = new google.maps.Map(document.getElementById('map'), options);

// add marker (unimelb in this case)
var marker = new google.maps.Marker({
    position:{lat:-37.7964, lng:144.9612},
    map:map,
    title: 'Melbourne'
});

// information window
var infowindow = new google.maps.InfoWindow({
    content:"This is Unimelb, Australia's number 1 University"
});

marker.addListener('click', function(){
    infowindow.open(map, marker);
});
}