// $(document).ready(function () {

//     $("#email").focusout(function () {
//         email_validator();
//     })

//     $("#pwd").focusout(function () {
//         password_validator();
//     })

//     $("#pwdConfirm").focusout(function () {
//         password_length_validator();
//     })


//     function email_validator() {
//         const pattern = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
//         var email = $('#email').val();

//         if (pattern.test(email) && email != "") {
//             $('#invalidEmail').css('display', 'none');
//             $('#email').removeClass('is-invalid');
//         } else {
//             $('#invalidEmail').css('display', 'block');
//             $('#email').addClass('is-invalid');
//         }
//     }

//     function password_validator() {
//         const min = 8;
//         var pwd = $('#pwd').val();

//         if (pwd.length >= min) {
//             $('#passwordLength').css('display', 'none');
//             $('#pwd').removeClass('is-invalid');
//         } else {
//             $('#passwordLength').css('display', 'block');
//             $('#pwd').addClass('is-invalid');
//         }
//     }

//     function password_length_validator() {
//         var pwd1 = $('#pwd').val();
//         var pwd2 = $('#pwdConfirm').val();

//         if (pwd1 === pwd2 && pwd2 != "") {
//             $('#passwordDifferent').css('display', 'none');
//             $('#pwdConfirm').removeClass('is-invalid');
//         } else {
//             $('#passwordDifferent').css('display', 'block');
//             $('#pwdConfirm').addClass('is-invalid');
//         }
//     }
// });




// ANDY's EXAMPLE CODE V




// (function(){
//     "use strict";

//     var state = document.getElementById('email');

//     document.addEventListener('DOMContentLoaded', function() {
//         document.getElementById('register-button').addEventListener('submit', register);

//         var button = document.getElementById('register-button');
//         button.disabled = true;
    
//         state.addEventListener('change', function() {
//             if(state === null){
//                 button.disabled = true;
//             }else{
//                 button.disabled = false;
//             }
//         })
//     })

// })();

// function register(event){
//     event.preventDefault();
//     console.log("hue");

//     if(state.value === null){
//         state.focus();
//     }
// }
