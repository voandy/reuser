// Get the modal
var modal = document.getElementById('modal');

// Get the button that opens the modal
var btn = document.getElementById('login-btn');

// Get the <span> element that closes the modal
// var span = document.getElementById('close');

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
        document.getElementById('login-btn').style.opacity = "0.6";
    }
}
// close log in bar
// function closeLogin() {
//     modal.style.display = "none";
// }


