const createListingURL = "/listing/id/";
const uploadImageURL = "/listing/image/id/";
const viewListingURL = "/view-listing?id=";

var createListing = document.getElementById("create-listing");
var listSubmit = document.getElementById("list-submit");

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

  var data = {
    title: listTitle,
    description: listDescription,
    formattedAddress: formattedAddress,
    category: listCategory,
    longitude: longitude,
    latitude: latitude
  };

  if (listDate) {
    data.dateExpires = listDate;
  }

  // create the listing
  $.ajax({
    type: "POST",
    url: createListingURL + userId,
    data: data,
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
