$(document).ready(function () {
    $("#email").focusout(function () {
        email_validator();
    })
    $("#pwd").focusout(function () {
        password_validator();
    })
    $("#pwdConfirm").focusout(function () {
        password_length_validator();
    })

    // if(email && pwd && pwdConfirm)
    //     $('button').prop('disabled', false);
    //     $('button').prop('disabled', true);
});

// validates format of email
function email_validator() {
    const pattern = /^([\\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    var email = $('#email').val();

    if (pattern.test(email) && email != "") {
        $('#invalidEmail').css('display', 'none');
        $('#email').removeClass('is-invalid');
        email = true;
    } else {
        $('#invalidEmail').css('display', 'block');
        $('#email').addClass('is-invalid');
    }
}

// validates Password and Confirm Password
function password_validator() {
    const min = 8;
    var pwd = $('#pwd').val();
    if (pwd.length >= min) {
        $('#passwordLength').css('display', 'none');
        $('#pwd').removeClass('is-invalid');
        pwd = true;
    } else {
        $('#passwordLength').css('display', 'block');
        $('#pwd').addClass('is-invalid');
    }
}

// validates Password and Confirm Password length
function password_length_validator() {
    var pwd1 = $('#pwd').val();
    var pwd2 = $('#pwdConfirm').val();
    if (pwd1 === pwd2 && pwd2 != "") {
        $('#passwordDifferent').css('display', 'none');
        $('#pwdConfirm').removeClass('is-invalid');
        pwdConfirm = true;
    } else {
        $('#passwordDifferent').css('display', 'block');
        $('#pwdConfirm').addClass('is-invalid');
    }
}