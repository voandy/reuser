function getFormValue() {
    var firstName = document.forms["formname"]["firstname"].value;
    var lastName = document.forms["formname"]["lastname"].value;
    alert("Hi " + firstName + " " + lastName);
}
