'use strict';


//Globals urls and div
var databaseActivities = "https://www.KVH.nl/db/DatabaseActivities.php";
var myVideosPage = "https://www.KVH.nl/pages/MyVideos.html";
var indexPage = "https://www.KVH.nl/index.html";
var adminPage = "https://www.KVH.nl/pages/Administrator.html";
var baseLink = "https://www.KVH.nl/";
var insertValidResult = "<div id='validResult'></div>";

window.onbeforeunload = confirmExit;
function confirmExit(){
    jQuery.ajax({
        method: "POST",
        data: {
            'setCorrectSession': true
        },
        url: databaseActivities,
        dataType: "json",
        success: function (result) {
            console.log(result);
        }
    });
}

//Keydown function
function focusOnloadKeydown(){
    getUserInfo();
    document.addEventListener("keydown", userPassCode, false);
}

function checkLoggedIn() {
    getUserInfo();
    jQuery.ajax({
        method: "POST",
        data: {
            'checkLoggedIn': true
        },
        url: databaseActivities,
        success: function (result) {
            var isLoggedIn = JSON.parse(result);
            if(isLoggedIn == false){
                window.open(baseLink, "_self");
            }else{
                userInfo();
                focusOnloadKeydown();
            }
        }
    });
}


//looks which code is pressed and only enter (keydown 13) and left mouse (keydown 0) click are correct
function userPassCode(e){
    if(e.keyCode === 13 || event.button === 0){
        checkValues();
    }else{
        return false;
    }
}


//Checking if all password conditions are correct and if they are than changing password
function checkValues(){
    checkCurrentPassword();
    checkPassword();
    checkPasswordConfirm();
    if(checkPassword() === true && checkPasswordConfirm() === true){
        changePassword();
    }
}


//Changing password in database
function changePassword(){
    var currentPassword = document.getElementById('currentPassword').value;
    var borderPassword= document.getElementById('currentPassword');
    var newPassword = document.getElementById('password').value;
    var newPasswordBorder = document.getElementById('password');
    var newPasswordConfirmBorder = document.getElementById('passwordConfirm');
    var insertResult = document.getElementById('insertValidResult');
    insertResult.innerHTML = insertValidResult;
    var validResult = document.getElementById('validResult');
    if(currentPassword === newPassword){
        jQuery("html, body").animate({ scrollTop: $(document).height() }, 1000);
        validResult.innerHTML = 'Uw huidige wachtwoord is het zelfde als het nieuwe wachtwoord';
        validResult.style.color = '#FF7888';
        borderPassword.style.borderColor = '#FF7888';
        newPasswordBorder.style.borderColor = '#FF7888';
        newPasswordConfirmBorder.style.borderColor = '#FF7888';
    }else{
        jQuery.ajax({
            method: "POST",
            data: {
                "changePassword": true,
                "password": currentPassword,
                "newPassword": newPassword
            },
            url: databaseActivities,
            success: function (result) {
                if(result === 'false' || result === false || result.length === 5){
                    jQuery("html, body").animate({ scrollTop: $(document).height() }, 1000);
                    validResult.innerHTML = 'Uw huidige wachtwoord komt niet overeen';
                    validResult.style.color = '#FF7888';
                    borderPassword.style.borderColor = '#FF7888';
                }else if(result === 'true' || result === true || result.length === 4){
                    jQuery("html, body").animate({ scrollTop: $(document).height() }, 1000);
                    borderPassword.style.borderColor = '#ccc';
                    validResult.innerHTML = "Wachtwoord is gewijzigd! <br> U wordt doorgestuurd naar de mijn video's pagina";
                    validResult.style.color = '#1387B9';
                    borderPassword.style.borderColor = '#1387B9';
                    newPasswordBorder.style.borderColor = '#1387B9';
                    newPasswordConfirmBorder.style.borderColor = '#1387B9';
                    var loader = "<div id='loader'></div>";
                    var spinner = document.getElementById('spinner');
                    spinner.style.display = 'inline';
                    spinner.innerHTML = loader;
                    setTimeout(function () {
                        window.open(myVideosPage, "_self");
                    }, 4000);
                }
            }
        });
    }
}


//Validating password
function checkCurrentPassword(){
    var password = document.getElementById('currentPassword').value;
    var border = document.getElementById('currentPassword');
    var validResult = document.getElementById('userCurrentPasswordValidResult');
    if(password.length === 0 || password === "" || password === null){
        validResult.innerHTML = 'Er is geen wachtwoord ingevoerd';
        validResult.style.color = '#FF7888';
        border.style.borderColor = '#FF7888';
        return false;
    }else if(password.length > 20){
        validResult.innerHTML = 'Wachtwoord mag niet langer zijn dan 20 characters';
        validResult.style.color = '#FF7888';
        border.style.borderColor = '#FF7888';
        return false;
    }else if(password.length < 6){
        validResult.innerHTML = 'Wachtwoord moet minstens zes characters bevatten';
        validResult.style.color = '#FF7888';
        border.style.borderColor = '#FF7888';
        return false;
    }else if(password.length >= 6 && password.length <= 15) {
        if(password === passwordConfirm){
            validResult.innerHTML = '';
            border.style.borderColor = '#21A68D';
            return true;
        }else{
            validResult.innerHTML = '';
            validResult.style.color = '#FF7888';
            border.style.borderColor = '#FF7888';
            return false;
        }
    }
}


//Validating password
function checkPassword(){
    var password = document.getElementById('password').value;
    var passwordConfirm = document.getElementById('passwordConfirm').value;
    var border = document.getElementById('password');
    var validResult = document.getElementById('userPasswordValidResult');

    if(password.length === 0 || password === "" || password === null){
        validResult.innerHTML = 'Er is geen wachtwoord ingevoerd';
        validResult.style.color = '#FF7888';
        border.style.borderColor = '#FF7888';
        return false;
    }else if(password.length > 20){
        validResult.innerHTML = 'Wachtwoord mag niet langer zijn dan 20 characters';
        validResult.style.color = '#FF7888';
        border.style.borderColor = '#FF7888';
        return false;
    }else if(password.length < 6){
        validResult.innerHTML = 'Wachtwoord moet minstens zes characters bevatten';
        validResult.style.color = '#FF7888';
        border.style.borderColor = '#FF7888';
        return false;
    }else if(password.length >= 6 && password.length <= 15) {
        if(password === passwordConfirm){
            validResult.innerHTML = '';
            border.style.borderColor = '#21A68D';
            return true;
        }else{
            validResult.innerHTML = 'Wachtwoorden komen niet overeen';
            validResult.style.color = '#FF7888';
            border.style.borderColor = '#FF7888';
            return false;
        }
    }
}


//Validating passwordConfirm
function checkPasswordConfirm(){
    var passwordConfirm = document.getElementById('passwordConfirm').value;
    var password = document.getElementById('password').value;
    var border = document.getElementById('passwordConfirm');
    var validResult2 = document.getElementById('userPasswordConfirmValidResult');

    if(passwordConfirm.length === 0 || passwordConfirm === "" || passwordConfirm === null){
        validResult2.innerHTML = 'Er is geen wachtwoord ingevoerd';
        validResult2.style.color = '#FF7888';
        border.style.borderColor = '#FF7888';
        return false;
    }else if(passwordConfirm.length > 20){
        validResult2.innerHTML = 'Wachtwoord mag niet langer zijn dan 20 characterss';
        validResult2.style.color = '#FF7888';
        border.style.borderColor = '#FF7888';
        return false;
    }else if(passwordConfirm.length < 6){
        validResult2.innerHTML = 'Wachtwoord moet minstens zes characters bevattenn';
        validResult2.style.color = '#FF7888';
        border.style.borderColor = '#FF7888';
        return false;
    }else if(passwordConfirm.length >= 6 && passwordConfirm.length <= 15) {
        if(passwordConfirm === password){
            validResult2.innerHTML = '';
            border.style.borderColor = '#21A68D';
            return true;
        }else{
            validResult2.innerHTML = 'Wachtwoorden komen niet overeenn';
            validResult2.style.color = '#FF7888';
            border.style.borderColor = '#FF7888';
            return false;
        }
    }
}


//Get user information (name, insertion, lastName and email) from database
var globals = {};
function getUserInfo(){
    jQuery.ajax({
        method: "POST",
        data: {
            'getUserInfo': true
        },
        url: databaseActivities,
        success: function (result) {
            if(result === null || result === "" || result.length <= 2 ){
                console.log('Geen correct email');
            }else{
                var userValues = JSON.parse(result);
                var fullName = userValues[0].name +" "+ userValues[0].insertion +" "+ userValues[0].lastName;
                globals['name'] = userValues[0].name;
                globals['insertion'] = userValues[0].insertion;
                globals['lastName'] = userValues[0].lastName;
                globals['fullName'] = fullName;
                globals['email'] = userValues[0].email;
                document.getElementsByClassName("userText")[0].innerHTML = "Welkom, "+fullName+" <br> " + userValues[0].email;
            }
        }
    });
}


function userInfo(){
    var stuffDiv = document.getElementById("dropdown");
        jQuery.ajax({
            method: "POST",
            data: {
                'checkUserIsAdmin': true
            },
            url: databaseActivities,
            success: function (result) {
                var admin = JSON.parse(result);
                console.log(admin);
                if(admin[0].admin == 1){
                    stuffDiv.innerHTML += "<div class='optionClassText' onClick='goToAdminPage();'>Beheer</div>";
                }
                stuffDiv.innerHTML += "<div class='optionClassText' onclick='goToMyVideosPage();'>Mijn video's</div>";
                stuffDiv.innerHTML += "<button class='buttonLogOut' onclick='logOut();'>Uitloggen</button>";
            }
        });
}


//Go to my videos
function changePass(){
    jQuery.ajax({
        method: "POST",
        data: {
            'setCorrectSession': true
        },
        url: databaseActivities,
        dataType: "json",
        success: function (result) {
            console.log(result);
        }
    });
    window.open(myVideosPage, "_self");
}

function goToMyVideosPage(){
    jQuery.ajax({
        method: "POST",
        data: {
            'setCorrectSession': true
        },
        url: databaseActivities,
        dataType: "json",
        success: function (result) {
            console.log(result);
            window.open(myVideosPage, "_self");
        }
    });
}


//Go to adminPage
function goToAdminPage(){
    jQuery.ajax({
        method: "POST",
        data: {
            'setCorrectSession': true
        },
        url: databaseActivities,
        dataType: "json",
        success: function (result) {
            console.log(result);
        }
    });
    window.open(adminPage, "_self");
}


//login out and destroy session
function logOut(){
    jQuery.ajax({
        method: "POST",
        data: {
            'logOut': true
        },
        url: databaseActivities,
        success: function () {
            window.open(indexPage,"_self");
        }
    });
}
