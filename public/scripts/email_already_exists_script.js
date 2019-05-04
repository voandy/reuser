document.getElementById("email").addEventListener("input", emailExists);

function emailExists() {
    var email = document.getElementById("email");
    var url = '/users/email/' + email;

    var request = new XMLHttpRequest();

    request.open('GET', userEmailURL);

    request.send();

    //request.status == 200 means data found while request.status == 304 means data not found
    if (request.status === 304) {
        alert("HAHAHHAHA!!!!");
    }
};