$(document).ready(function () {
    $("#email").focusout(function () {
        email_validator();
    });
    $("#password").focusout(function () {
        password_validator();
    });
    $("#pwdConfirm").focusout(function () {
        password_length_validator();
    });
});

// given a listing, will get the associated user and add to that listing
function createUser(){
    var fullName = $('#fullName').val();
    var email = $('#email').val();
    var password = $('#password').val();

    
    if (fullName == '' || email == '' || password == '') {
        alert("Please Fill All Fields");
    }
    else {
        var body =
            { 
                'fullName': fullName,
                'email': email,
                'password': password 
            };

        $.ajax({
            type: "POST",
            url: '/user',
            data: JSON.stringify(body),
            contentType: 'application/json'
        });
        // $.post('/user', JSON.stringify(body));
        // alert("Post Success");
    }
}

function email_validator() {
    const pattern = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    var email = $('#email').val();
    
    if (pattern.test(email)) {
        $('#invalidEmail').css('display', 'none');
        $('#email').removeClass('is-invalid');
    } else {
        $('#invalidEmail').css('display', 'block');
        $('#email').addClass('is-invalid');
    }
}

function password_validator() {
    const min = 8;
    var pwd = $('#password').val();
    if (pwd.length >= min) {
        $('#passwordLength').css('display', 'none');
        $('#password').removeClass('is-invalid');
    } else {
        $('#passwordLength').css('display', 'block');
        $('#password').addClass('is-invalid');
    }
}

function password_length_validator() {
    var pwd1 = $('#password').val();
    var pwd2 = $('#pwdConfirm').val();
    if (pwd1 === pwd2 && pwd2 != "") {
        $('#passwordDifferent').css('display', 'none');
        $('#pwdConfirm').removeClass('is-invalid');
    } else {
        $('#passwordDifferent').css('display', 'block');
        $('#pwdConfirm').addClass('is-invalid');
    }
}




