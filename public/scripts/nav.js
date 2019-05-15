// Get the modal
var modal = document.getElementById('modal');

// Get the button that opens the modal
var btn = document.getElementById('login-btn');


// open log in bar
function openLogin(){

    // disable login popup
    if(modal.style.display == "block"){
        modal.style.display = "none";
        document.getElementById('login-btn').style.opacity = "1";
    }
    // enable login popup
    else{
        modal.style.display = "block";
        changeToName();
    }
}

function changeToName(){

  if(1){
    document.getElementById("login-btn").innerHTML = "account";
    // document.getElementById("nav-login-img").src = "something.jpg";

  }
}

// When the user clicks anywhere outside of the modal, close it
window.addEventListener('click', function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
});

// support for mobile devices
window.addEventListener('touchstart', function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
});
