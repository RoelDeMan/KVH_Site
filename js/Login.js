'use strict';

var databaseActivities = "../db/DatabaseActivities.php";
var homePage = "https://www.KVH.nl/pages/Homepage.html";
var overviewPage = "https://www.KVH.nl/pages/MyVideos.html";
var registerPage = "https://www.KVH.nl/pages/Register.html";
var passwordForgottenPage = "https://www.KVH.nl/pages/passwordForgotten.html";

function focusOnloadKeydown(){
    document.addEventListener("keydown", login, false);
}

function checkLoggedIn() {
    jQuery.ajax({
        method: "POST",
        data: {
            'newCookie': true
        },
        url: databaseActivities,
        dataType: "json",
        success: function (result) {
            jQuery.ajax({
                method: "POST",
                data: {
                    'checkLoggedIn': true
                },
                url: databaseActivities,
                dataType: "json",
                success: function (result) {
                    focusOnloadKeydown();
                }
            });
        }
    });
}

var insertValidResult =  "<div id='validResult'></div>";

function login(e){
    var inputEmail = document.getElementById('email');
    var inputPassword = document.getElementById('password');
    if(e.keyCode === 13 || e.button === 0){
        checkInput(inputEmail.value, inputPassword.value);
    }else{
        return false;
    }
}
function checkInput (inputEmail, inputPassword) {
  var insertResult = document.getElementById('insertValidResult');
    insertResult.innerHTML = insertValidResult;
  var validResult = document.getElementById('validResult');
  var borderColorEmail = document.getElementById('email');
  var borderColorPassword = document.getElementById('password');
    validResult.innerHTML = "";
          if(inputEmail.length === 0 && inputPassword.length === 0) {

            validResult.innerHTML = 'Er is geen email en wachtwoord ingevoerd';
            validResult.style.color = '#FF7888';
            borderColorEmail.style.borderColor = '#FF7888';
            borderColorPassword.style.borderColor = '#FF7888';
              return false;
          }else if (inputPassword.length === 0){
            validResult.innerHTML = 'Er is geen wachtwoord ingevoerd';
            validResult.style.color = '#FF7888';
            borderColorPassword.style.borderColor = '#FF7888';
            borderColorEmail.style.borderColor = '#ccc';
                return false;
          }else if (inputEmail.length === 0) {
            validResult.innerHTML = 'Er is geen email ingevoerd ';
            validResult.style.color = '#FF7888';
            borderColorEmail.style.borderColor = '#FF7888';
            borderColorPassword.style.borderColor = '#ccc';
                return false;
          }else{
            validResult.innerHTML = "";
            insertResult.innerHTML = "";
                getUser(inputEmail, inputPassword);
          }
}


//Email to lowercase
function lowerCase(userEmail){
    var lowerEmail = userEmail.toLowerCase();
    return lowerEmail;
}


function getUser(inputEmail, inputPassword){
    var lowerCaseEmail = lowerCase(inputEmail);
        jQuery.ajax({
            method: "POST",
            data: {
                'authenticateUser': true,
                'email': lowerCaseEmail,
                'password': inputPassword
            },
            url: databaseActivities,
            dataType: "json",
            success: function (result) {
                checkUser(result);
            }
        });
}


function checkUser(result) {
    var insertResult = document.getElementById('insertValidResult');
    insertResult.innerHTML = insertValidResult;
    var validResult = document.getElementById('validResult');
    var borderColorEmail = document.getElementById('email');
    var borderColorPassword = document.getElementById('password');
   if (result === 'unAuthorized') {
       validResult.innerHTML = 'Uw account is nog niet goedgekeurd';
       validResult.style.color = '#FF7888';
       borderColorEmail.style.borderColor = '#FF7888';
       borderColorPassword.style.borderColor = '#FF7888';
   }else if (result === 'true' || result === true) {
        borderColorEmail.style.borderColor = '#ccc';
        borderColorPassword.style.borderColor = '#ccc';
        validResult.innerHTML = "";
        validResult.innerHTML = 'Gegevens zijn correct! Uw wordt doorgestuurd';
        validResult.style.color = '#1387B9';
        var loader = "<div id='loader'></div>";
        var spinner = document.getElementById('spinner');
        spinner.style.display = 'inline';
        spinner.innerHTML = loader;
        setTimeout(function () {
            jQuery.ajax({
                method: "POST",
                data: {
                    'setCorrectSession': true
                },
                url: databaseActivities,
                dataType: "json",
                success: function (result) {
                    console.log(result);
                    window.open(homePage, "_self");
                }
            });
        }, 1000);
    } else {
        validResult.innerHTML = 'Gebruiker bestaat niet of gegevens komen niet overeen';
        validResult.style.color = '#FF7888';
        borderColorEmail.style.borderColor = '#FF7888';
        borderColorPassword.style.borderColor = '#FF7888';
    }
}

function openRegisterPage(){
    window.open(registerPage, "_self");
}


function openPasswordForgottenPage(){
    window.open(passwordForgottenPage, "_self");
}
