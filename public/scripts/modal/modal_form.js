var modalBackground = document.getElementById("modal-background");
var modalGrid = document.getElementById("modal-grid");
var btn = document.getElementById("modal-form-button");

// opens filter form on click
btn.onclick = function() {
  modalGrid.style.display = "block";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modalBackground) {
    modalGrid.style.display = "none";
  }
}

// support for mobile devices
window.addEventListener('touchstart', function(event) {
  if (event.target == modalBackground) {
    modal.style.display = "none";
  }
});
