const listingURI = "http://127.0.0.1:7900/listing/id/";
const listingId = window.location.search.substring(1);

var listing;
var concAddress;

const title = document.getElementById('title');
const description = document.getElementById('description');
const datePosted = document.getElementById('datePosted');
const dateExpires = document.getElementById('dateExpires');
const address = document.getElementById('address');
const category = document.getElementById('category');

function getListing(listingId){
  return new Promise(resolve => {
    jQuery.get(listingURI + listingId, function(data){
      listing = data;
      resolve();
    });
  });
}

getListing(listingId).then(function(){
  concAddress =
    listing.address.addressLine1 +
    ((listing.addressLine2 != null) ? ", " + listing.address.addressLine2 : "") + ", " +
    listing.address.suburb + " " +
    listing.address.state + " " +
    listing.address.postcode;

  title.innerText = listing.title;
  description.innerText = listing.description;
  datePosted.innerText = listing.datePosted;
  dateExpires.innerText = listing.dateExpires;
  address.innerText = concAddress;
  category.innerText = listing.category;
});
