'use strict';


//Globals variables
var databaseActivities = "https://www.KVH.nl/db/DatabaseActivities.php";
var loginPage = "https://www.KVH.nl/index.html";
var adminPage = "https://www.KVH.nl/pages/Administrator.html";
var insertValidResult =  "<div id='validResult'></div>";


//Get keydown nummer and pass to CheckAllValues
function focusOnloadKeydown(){
    document.addEventListener("keydown", CheckAllValues, false);
}


//Check all values from the inputs
function CheckAllValues(e) {
    if(e.keyCode === 13 || event.button === 0) {
        checkName();
        checkInsertion();
        checkLastName();
        checkEmail();
        checkPassword();
        checkPasswordConfirm();
            if(checkName() === true && checkInsertion() === true && checkLastName() === true && checkEmail() === true && checkPassword() === true && checkPasswordConfirm() === true){
                var name = document.getElementById('userName').value;
                var insertion = document.getElementById('userInsertion').value;
                var lastName = document.getElementById('userLastName').value;
                var email = document.getElementById('userEmail').value;
                var password = document.getElementById('userPassword').value;
                    addUser(name, insertion, lastName, email, password);
            }
    }
}


//Email to lowercase
function lowerCase(userEmail){
    var lowerEmail = userEmail.toLowerCase();
    return lowerEmail;
}


//Add user to database
function addUser(userName, userInsertion, userLastName, userEmail, userPassword){
    var lowerCaseEmail = lowerCase(userEmail);
        jQuery.ajax({
            method: "POST",
            data: {
                'addUser': true,
                'name': userName,
                'insertion': userInsertion,
                'lastName': userLastName,
                'email': lowerCaseEmail,
                'password': userPassword,
                "url": loginPage
            },
            url: databaseActivities,
            success: function (result) {
                var insertResult = document.getElementById('insertValidResult');
                insertResult.innerHTML = insertValidResult;
                var validResult = document.getElementById('validResult');
                if (result === 'false' || result === false || result.length === 5) {
                    jQuery("html, body").animate({scrollTop: $(document).height()}, 1000);
                    validResult.innerHTML = 'Email bestaat al';
                    validResult.style.color = '#FF7888';
                } else if (result === 'true' || result === true || result.length === 4) {
                    jQuery("html, body").animate({scrollTop: $(document).height()}, 1000);
                    validResult.innerHTML = 'De ingevoerde gegevens zijn opgeslagen! <br> Uw account zal nog worden goedgekeurd door een applicatiebeheerder';
                    validResult.style.color = '#21A68D';
                    var loader = "<div id='loader'></div>";
                    var spinner = document.getElementById('spinner');
                    spinner.style.display = 'inline';
                    spinner.innerHTML = loader;
                    setTimeout(function () {
                        window.open(loginPage, "_self");
                    }, 5000);
                }
            }
        });
}



//Validating userName
function checkName(){
    var name = document.getElementById('userName').value;
    var border = document.getElementById('userName');
    var nameResult = document.getElementById('userNameValidResult');
        if(name.length === 0 || name === "" || name === null){
            nameResult.innerHTML = 'Er is geen naam ingevoerd';
            nameResult.style.color = '#FF7888';
            border.style.borderColor = '#FF7888';
            return false;
        }else if(name.length > 20){
            nameResult.innerHTML = 'Een naam mag niet langer zijn dan 20 characters zijn';
            nameResult.style.color = '#FF7888';
            border.style.borderColor = '#FF7888';
            return false;
        }else if(name.length <= 1){
            nameResult.innerHTML = 'Een naam moet langer zijn dan een character';
            nameResult.style.color = '#FF7888';
            border.style.borderColor = '#FF7888';
            return false;
        }else if(name.length >= 2 && name.length <= 20) {
            var symbols = /^[A-Za-z-^`,.'"]+$/;
                if(name.match(symbols)){
                    nameResult.innerHTML = '';
                    border.style.borderColor = '#1387B9';
                    return true;
                }else{
                    nameResult.innerHTML = 'Gebruik geen cijfers in een naam';
                    nameResult.style.color = '#FF7888';
                    border.style.borderColor = '#FF7888';
                    return false;
                }
        }
}


//Validating insertion
function checkInsertion(){
    var insertion = document.getElementById('userInsertion').value;
    var border = document.getElementById('userInsertion');
    var insertionResult = document.getElementById('userInsertionValidResult');
        if (insertion.length === 0 || insertion === "" || insertion === null){
            insertionResult.innerHTML = '';
            border.style.borderColor = '#21A68D';
            return true;
        }else if(insertion.length === 1){
            insertionResult.innerHTML = 'Een tussenvoegsel moet langer zijn dan een character';
            insertionResult.style.color = '#FF7888';
            border.style.borderColor = '#FF7888';
            return false;
        }else if(insertion.length > 10){
            insertionResult.innerHTML = 'Een tussenvoegsel mag niet langer zijn dan tien characters zijn';
            insertionResult.style.color = '#FF7888';
            border.style.borderColor = '#FF7888';
            return false;
        }else if(insertion.length >= 2 && insertion.length <= 10){
            var symbols = /^[A-Za-z-^`,.'"]+$/;
            if(insertion.match(symbols)){
                insertionResult.innerHTML = '';
                border.style.borderColor = '#1387B9';
                return true;
            }else{
                insertionResult.innerHTML = 'Gebruik geen cijfers in een tussenvoegsel';
                insertionResult.style.color = '#FF7888';
                border.style.borderColor = '#FF7888';
                return false;
            }
        }
}


//Validating userLastName
function checkLastName(){
    var lastName = document.getElementById('userLastName').value;
    var border = document.getElementById('userLastName');
    var lastNameResult = document.getElementById('userLastNameValidResult');
    if(lastName.length === 0 || lastName === "" || lastName === null){
        lastNameResult.innerHTML = 'Er is geen achternaam ingevoerd';
        lastNameResult.style.color = '#FF7888';
        border.style.borderColor = '#FF7888';
        return false;
    }else if(lastName.length > 20){
        lastNameResult.innerHTML = 'Een achternaam mag niet langer zijn dan 20 characters zijn';
        lastNameResult.style.color = '#FF7888';
        border.style.borderColor = '#FF7888';
        return false;
    }else if(lastName.length <= 1){
        lastNameResult.innerHTML = 'Een achternaam moet langer zijn dan een character';
        lastNameResult.style.color = '#FF7888';
        border.style.borderColor = '#FF7888';
        return false;
    }else if(lastName.length >= 2 && lastName.length <= 20) {
        var symbols = /^[A-Za-z-^`,.'"]+$/;
        if(lastName.match(symbols)){
            lastNameResult.innerHTML = '';
            border.style.borderColor = '#1387B9';
            return true;
        }else{
            lastNameResult.innerHTML = 'Gebruik geen cijfers in een achternaam';
            lastNameResult.style.color = '#FF7888';
            border.style.borderColor = '#FF7888';
            return false;
        }
    }
}


//Validating email en the email conditions
function conditionsEmail(email) {
    var conditions = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return conditions.test(email);
}


//Check Emailadres
function checkEmail(){
    var email = document.getElementById('userEmail').value;
    var border = document.getElementById('userEmail');
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
            }else{
                emailResult.innerHTML = 'Dit is geen correcte emailadres';
                emailResult.style.color = '#FF7888';
                border.style.borderColor = '#FF7888';
                return false;
            }
    }
}


//Validating password
function checkPassword(){
    var password = document.getElementById('userPassword').value;
    var passwordConfirm = document.getElementById('userPasswordConfirm').value;
    var border = document.getElementById('userPassword');
    var passwordResult = document.getElementById('userPasswordValidResult');
    if(password.length === 0 || password === "" || password === null){
        passwordResult.innerHTML = 'Er is geen wachtwoord ingevoerd';
        passwordResult.style.color = '#FF7888';
        border.style.borderColor = '#FF7888';
        return false;
    }else if(password.length > 20){
        passwordResult.innerHTML = 'Wachtwoord mag niet langer zijn dan 20 characters';
        passwordResult.style.color = '#FF7888';
        border.style.borderColor = '#FF7888';
        return false;
    }else if(password.length < 6){
        passwordResult.innerHTML = 'Wachtwoord moet minstens zes characters bevatten';
        passwordResult.style.color = '#FF7888';
        border.style.borderColor = '#FF7888';
        return false;
    }else if(password.length >= 6 && password.length <= 15) {
        if(password === passwordConfirm){
            passwordResult.innerHTML = '';
            border.style.borderColor = '#1387B9';
            return true;
        }else{
            passwordResult.innerHTML = 'Wachtwoorden komen niet overeen';
            passwordResult.style.color = '#FF7888';
            border.style.borderColor = '#FF7888';
            return false;
        }
    }
}


//Validating passwordConfirm
function checkPasswordConfirm(){
    var passwordConfirm = document.getElementById('userPasswordConfirm').value;
    var password = document.getElementById('userPassword').value;
    var border = document.getElementById('userPasswordConfirm');
    var passwordConfirmResult = document.getElementById('userPasswordConfirmValidResult');
    if(passwordConfirm.length === 0 || passwordConfirm === "" || passwordConfirm === null){
        passwordConfirmResult.innerHTML = 'Er is geen wachtwoord ingevoerd';
        passwordConfirmResult.style.color = '#FF7888';
        border.style.borderColor = '#FF7888';
        return false;
    }else if(passwordConfirm.length > 20){
        passwordConfirmResult.innerHTML = 'Wachtwoord mag niet langer zijn dan 20 characters';
        passwordConfirmResult.style.color = '#FF7888';
        border.style.borderColor = '#FF7888';
        return false;
    }else if(passwordConfirm.length < 6){
        passwordConfirmResult.innerHTML = 'Wachtwoord moet minstens zes characters bevatten';
        passwordConfirmResult.style.color = '#FF7888';
        border.style.borderColor = '#FF7888';
        return false;
    }else if(passwordConfirm.length >= 6 && passwordConfirm.length <= 15) {
        if(passwordConfirm === password){
            passwordConfirmResult.innerHTML = '';
            border.style.borderColor = '#1387B9';
            return true;
        }else{
            passwordConfirmResult.innerHTML = 'Wachtwoorden komen niet overeen';
            passwordConfirmResult.style.color = '#FF7888';
            border.style.borderColor = '#FF7888';
            return false;
        }
    }
}
