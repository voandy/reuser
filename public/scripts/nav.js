// Get the modal
var loginModal = document.getElementById('login-modal');

// Get the button that opens the modal
var btn = document.getElementById('login-btn');


// open log in bar
function openLogin(){

    // disable login popup
    if(loginModal.style.display == "block"){
        loginModal.style.display = "none";
        document.getElementById('login-btn').style.opacity = "1";
    }
    // enable login popup
    else{
        loginModal.style.display = "block";
    }
}

// When the user clicks anywhere outside of the modal, close it
window.addEventListener('click', function(event) {
  if (event.target == loginModal) {
    loginModal.style.display = "none";
  }
});

// support for mobile devices
window.addEventListener('touchstart', function(event) {
  if (event.target == loginModal) {
    loginModal.style.display = "none";
  }
});
