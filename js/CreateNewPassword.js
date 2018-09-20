'use strict';


//Globals urls and div
var databaseActivities = "https://www.KVH.nl/db/DatabaseActivities.php";
var indexPage = "https://www.KVH.nl/index.html";
var insertValidResult = "<div id='validResult'></div>";


//Keydown function
function focusOnloadKeydown(){
    document.addEventListener("keydown", userPassCode, false);
}


//looks which code is pressed and only enter (keydown 13) and left mouse (keydown 0) click are correct
function userPassCode(e){
    if(e.keyCode === 13 || event.button === 0){
        checkValues();
    }else{
        return false;
    }
}



//Checking if all input (email, code and passwords) conditions are correct and if they are than changing password
function checkValues(){
    checkEmail();
    checkCode();
    checkPassword();
    checkPasswordConfirm();
        if(checkPassword() === true && checkPasswordConfirm() === true && checkEmail() === true){
            changeNewPass();
        }
}


//Email condition function
function conditionsEmail(email) {
    var conditions = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return conditions.test(email);
}


//Validate Email
function checkEmail(){
    var email = document.getElementById('email').value;
    var border = document.getElementById('email');
    var emailResult = document.getElementById('userEmailValidResult');
    var CheckEmailConditions = conditionsEmail(email);
    if(email.length === 0 || email === "" || email === null){
        emailResult.innerHTML = 'Er is geen email ingevoerd';
        emailResult.style.color = '#FF7888';
        border.style.borderColor = '#FF7888';
        return false;
    }else if(email.length > 35){
        emailResult.innerHTML = 'Een emailadres mag niet langer zijn dan 35 characters';
        emailResult.style.color = '#FF7888';
        border.style.borderColor = '#FF7888';
        return false;
    }else if(email.length < 6){
        emailResult.innerHTML = 'Een emailadres moet minstens zes characters bevatten';
        emailResult.style.color = '#FF7888';
        border.style.borderColor = '#FF7888';
        return false;
    }else if(email.length >= 6 && email.length <= 35) {
            if (CheckEmailConditions === true){
                emailResult.innerHTML = '';
                border.style.borderColor = '#1387B9';
                return true;
            }else {
                emailResult.innerHTML = 'Dit is geen correcte emailadres';
                emailResult.style.color = '#FF7888';
                border.style.borderColor = '#FF7888';
                return false;
            }
    }
}


//Validate
function checkCode() {
    var passCode = document.getElementById('passCode').value;
    var border = document.getElementById('passCode');
    var validResult2 = document.getElementById('userPassCodeValidResult');
    if(passCode.length === 0 || passCode === "" || passCode === null){
            validResult2.innerHTML = 'Er is geen code ingevoerd';
            validResult2.style.color = '#FF7888';
            border.style.borderColor = '#FF7888';
        return false;
    }else if(passCode.length > 4) {
            validResult2.innerHTML = 'De code bevat maar vier cijfers';
            validResult2.style.color = '#FF7888';
            border.style.borderColor = '#FF7888';
        return false;
    }else if(passCode.length < 4){
            validResult2.innerHTML = 'De code bestaat uit vier cijfers';
            validResult2.style.color = '#FF7888';
            border.style.borderColor = '#FF7888';
    }else if(passCode.length === 4) {
        var conditions = /^\d+$/;
        var result = conditions.test(passCode);
            if(result === true){
                validResult2.innerHTML = '';
                border.style.borderColor = '#1387B9';
                return true;
            }else{
                validResult2.innerHTML = 'De code bestaat alleen uit cijfers';
                validResult2.style.color = '#FF7888';
                border.style.borderColor = '#FF7888';
                return false;
            }
    }
}


//Email to lowercase
function lowerCase(userEmail){
    var lowerEmail = userEmail.toLowerCase();
    return lowerEmail;
}


//Changing password in database
function changeNewPass(){
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var codeValue = document.getElementById('passCode').value;
    var insertResult = document.getElementById('insertValidResult');
    insertResult.innerHTML = insertValidResult;
    var validResult = document.getElementById('validResult');
    var borderColorEmail = document.getElementById('email');
    var borderColorPassCode = document.getElementById('passCode');
    var lowerCaseEmail = lowerCase(email);
        jQuery.ajax({
            method: "POST",
            data: {
                "getCorrectPassCode": true,
                "email": lowerCaseEmail,
                "newPassword": password,
                "passwordCode": codeValue
            },
            url: databaseActivities,
            success: function (result) {

                    if(result === 'false' || result === false || result.length === 5){
                        jQuery("html, body").animate({ scrollTop: $(document).height() }, 1000);
                        validResult.innerHTML = 'Email of code is incorrect';
                        validResult.style.color = '#FF7888';
                        borderColorEmail.style.borderColor = '#FF7888';
                        borderColorPassCode.style.borderColor = '#FF7888';
                    }else if(result === 'true' || result === true || result.length === 4){
                        jQuery("html, body").animate({ scrollTop: $(document).height() }, 1000);
                        borderColorEmail.style.borderColor = '#ccc';
                        validResult.innerHTML = 'Wachtwoord is gewijzigd! <br> U wordt doorgestuurd naar de loginpagina';
                        validResult.style.color = '#1387B9';
                        var loader = "<div id='loader'></div>";
                        var spinner = document.getElementById('spinner');
                        spinner.style.display = 'inline';
                        spinner.innerHTML = loader;
                        setTimeout(function () {
                            window.open(indexPage, "_self");
                        }, 4000);
                    }
            }
        });
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
    }else if(password.length >= 21){
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
            border.style.borderColor = '#1387B9';
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
    }else if(passwordConfirm.length >= 21){
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
            border.style.borderColor = '#1387B9';
            return true;
        }else{
            validResult2.innerHTML = 'Wachtwoorden komen niet overeenn';
            validResult2.style.color = '#FF7888';
            border.style.borderColor = '#FF7888';
            return false;
        }
    }
}
