const activeListings = document.getElementsByClassName('active-listings');
const archivedListings = document.getElementsByClassName('archived-listings');

document.getElementById('active-listings-button').onclick = function() { 
    showActiveListings();
    hideArchivedListings();
};

document.getElementById('archived-listings-button').onclick = function() { 
    hideActiveListings();
    showArchivedListings();
};


function hideActiveListings() {
    for (var i = 0; i < activeListings.length; i++) {
        activeListings[i].style.display = 'none';
    }
}

function showActiveListings() {
    for (var i = 0; i < activeListings.length; i++) {
        activeListings[i].style.display = 'block';
    }
}

function hideArchivedListings() {
    for (var i = 0; i < archivedListings.length; i++) {
        archivedListings[i].style.display = 'none';
    }
}

function showArchivedListings() {
    for (var i = 0; i < archivedListings.length; i++) {
        archivedListings[i].style.display = 'block';
    }
}