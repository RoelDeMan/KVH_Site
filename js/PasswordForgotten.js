'use strict';

var databaseActivities = "https://www.KVH.nl/db/DatabaseActivities.php";
var indexPage = "https://www.KVH.nl/index.html";
var changePasswordPage = "https://www.KVH.nl/pages/CreateNewPassword.html";


function focusOnloadKeydown(){
    document.addEventListener("keydown", login, false);
}


var insertValidResult =  "<div id='validResult'></div>";


function login(e){
    var inputEmail = document.getElementById('email');
    if(e.keyCode === 13 || event.button === 0){
        getEmail(inputEmail.value);
    }else{
        return false;
    }
}


function getEmail(userEmail) {
    var insertResult = document.getElementById('insertValidResult');
    insertResult.innerHTML = insertValidResult;
    var validResult = document.getElementById('validResult');
    var borderColorEmail = document.getElementById('email');

    if(userEmail === null || userEmail === '' || userEmail.length === 0){
        validResult.innerHTML = 'Er is geen email ingevuld';
        validResult.style.color = '#FF7888';
        borderColorEmail.style.borderColor = '#FF7888';
    }else{
        jQuery.ajax({
            method: "POST",
            data: {
                "userExistAndSendMail": true,
                "email": userEmail,
                "url": changePasswordPage
            },
            url: databaseActivities,
            success: function (result) {
                if (result === null || result.length === 0 || result.length === 2 || result.length === 1 || result === '[]') {
                    jQuery("html, body").animate({ scrollTop: $(document).height() }, 1000);
                    validResult.innerHTML = 'Email bestaat niet';
                    validResult.style.color = '#FF7888';
                    borderColorEmail.style.borderColor = '#FF7888';
                }else {
                    if(userEmail === result){
                        jQuery("html, body").animate({ scrollTop: $(document).height() }, 1000);
                        borderColorEmail.style.borderColor = '#ccc';
                        validResult.innerHTML = "";
                        validResult.innerHTML = 'Email is verstuurd! <br> U wordt doorgestuurd naar de loginpagina';
                        validResult.style.color = '#1387B9';
                        var loader = "<div id='loader'></div>";
                        var spinner = document.getElementById('spinner');
                        spinner.style.display = 'inline';
                        spinner.innerHTML = loader;
                        setTimeout(function () {
                            window.open(indexPage, "_self");
                        }, 4000);
                    }else{
                        validResult.innerHTML = 'Email bestaat niet';
                        validResult.style.color = '#FF7888';
                        borderColorEmail.style.borderColor = '#FF7888';
                    }
                }
            }
        });
    }
}
