/* Enums */
const warning = Object.freeze({
    FULLNAME: 'fullname',
    EMAIL: 'email',
    EMAIL_UNIQUE: 'email_unique',
    PASSWORD: 'password',
    PASSWORD_CONFIRM: 'password_confirm'
});

const event = Object.freeze({
    CHECKING: 'checking',
    SUBMIT: 'submit'
})


$(document).ready(function() {
    $("#fullName").focusout(function() {
        show_warning(warning.FULLNAME, name_validator(event.CHECKING));
    });
    $("#email").focusout(function() {
        show_warning(warning.EMAIL, email_validator(event.CHECKING));
        email_uniqueness_validator($('email').val());
    });
    $("#password").focusout(function() {
        show_warning(warning.PASSWORD, password_validator(event.CHECKING));
    });
    $("#passwordConfirm").focusout(function() {
        show_warning(warning.PASSWORD_CONFIRM, password_confirm_validator(event.CHECKING));
    });
});

// $(document).ready(function() {
//     $('#registerform').on('submit', function(e) {
//         // e.preventDefault();
//         //  // check if all fields contain valid values
//         // if (email_validator(event.SUBMIT) && password_validator(event.SUBMIT) && password_confirm_validator(event.SUBMIT)) {
//         //     createUser();
//         // // otherwise show appropriate warnings
//         // } else {
//         //     show_warning(warning.FULLNAME, email_validator(event.SUBMIT));
//         //     show_warning(warning.EMAIL, email_validator(event.SUBMIT));
//         //     show_warning(warning.PASSWORD, email_validator(event.SUBMIT));
//         //     show_warning(warning.PASSWORD_CONFIRM, password_confirm_validator(event.SUBMIT));
//         // }
//         createUser();
//     });
// });

function createUser(){
    // get all the required values
    var fullName = $('#fullName').val();
    var email = $('#email').val();
    var password = $('#password').val();
    var password_cfm = $('#password_cfm').val();
    // create body structure
    var body = JSON.stringify({
        'fullName': fullName,
        'email': email,
        'password': password,
        'password_cfm': password_cfm
    });
    // post to server
    $.ajax({
        type: "POST",
        url: '/user',
        data: body,
        contentType: 'application/json',
        error: function (jXHR, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
}

function name_validator(event_type) {
    var fullname = $('#fullName').val();
    // check event type
    switch (event_type) {
        case event.CHECKING:
            // pass validation
            if (fullname.length >= 3 || fullname.length == 0) return true;
            break;

        case event.SUBMIT:
            // pass validation
            if (fullname.length >= 3  && fullname.length != 0) return true;
            break;
    }
    // fail
    return false;
}

function email_validator(event_type) {
    const pattern = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    var email = $('#email').val();
    // check event type
    switch (event_type) {
        case event.CHECKING:
            // pass validation
            if (pattern.test(email) || email.length == 0) return true;
            break;

        case event.SUBMIT:
            // pass validation
            if (pattern.test(email) && email.length != 0) return true;
            break;
    }
    // fail
    return false;
}

function email_uniqueness_validator(email) {
    $.ajax({
        type: "GET",
        url: '/user/email/' + email,
        success: function (data) {
            if (data.length > 0) {
                $('#emailNotUnique').css('display', 'block');
            } else {
                $('#emailNotUnique').css('display', 'none');
            }
        },
        error: function(jxHR, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
}

function password_validator(event_type) {
    const min = 8;
    var pwd = $('#password').val();
    // check event type
    switch (event_type) {
        case event.CHECKING:
            // pass validation
            if (pwd.length >= min || pwd.length == 0) return true;
            break;

        case event.SUBMIT:
            // pass validation
            if (pwd.length >= min && pwd.length != 0) return true;
            break;
    }
   return false;
}

function password_confirm_validator(event_type) {
    var pwd1 = $('#password').val();
    var pwd2 = $('#passwordConfirm').val();
    // check event type
    switch (event_type) {
        case event.CHECKING:
            // pass validation
            if ((pwd1 === pwd2 && pwd2 != "") || pwd2.length == 0) return true;
            break;

        case event.SUBMIT:
            // pass validation
            if ((pwd1 === pwd2 && pwd2 != "") && pwd2.length != 0) return true;
            break;
    }
    return false;
}

// show warning
function show_warning(warning_type, notToShow) {
    switch (warning_type) {
        case warning.FULLNAME:
            if (notToShow) {
                $('#invalidName').css('display', 'none');
            } else {
                $('#invalidName').css('display', 'block');
            }
            break;
        case warning.EMAIL:
            if (notToShow) {
                $('#invalidEmail').css('display', 'none');
            } else {
                $('#invalidEmail').css('display', 'block');
            }
            break;

        case warning.EMAIL_UNIQUE:
            if (notToShow) {
                $('#emailNotUnique').css('display', 'none');
            } else {
            }

        case warning.PASSWORD:
            if (notToShow) {
                $('#passwordLength').css('display', 'none');
            } else {
                $('#passwordLength').css('display', 'block');
            }
            break;

        case warning.PASSWORD_CONFIRM:
            if (notToShow) {
                $('#passwordDifferent').css('display', 'none');
            } else {
                $('#passwordDifferent').css('display', 'block');
            }
            break;
    }
}
