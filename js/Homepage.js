'use strict';

var baseLink = 'https://www.KVH.nl/';
var databaseActivities = baseLink + "db/DatabaseActivities.php";
var myVideos = baseLink + "pages/MyVideos.html";
var changePasswordPage = baseLink + "pages/ChangePassword.html";
var adminPage = baseLink + "pages/Administrator.html";

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

function openMenuPage(page){
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
  window.open(baseLink+"pages/"+page,"_self");
}

//Check if users has permission to view the page
function checkUserRights(){
    jQuery.ajax({
        method: "POST",
        data: {
            'checkUserIsAdmin': true,
        },
        url: databaseActivities,
        success: function (result){
            var admin = JSON.parse(result);
            if(admin.length != 0){
                if(admin[0].admin == "1"){
                    checkLoggedIn();
                }else {
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
                    window.open(myVideos, "_self");
                }
            }else{
                window.open(baseLink, "_self");
            }
        }
    });
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
                //getAllUsers();
            }
        }
    });
}


//Get all users from database
function getAllUsers(){
    getUserInfo();
    var users = document.getElementById('allUsers');
    jQuery.ajax({
        method: "POST",
        data: {
            'getAllUsersForAdmin': true
        },
        url: databaseActivities,
        success: function (result){
            var allUsers = JSON.parse(result);
            for (var i = 0 ; i < allUsers.length; i++){
                var userRow = "";
                if(allUsers[i].email != "roel.deman@han.nl" && allUsers[i].email != "michel.hansma@han.nl" &&
                    allUsers[i].email != "jasper.jeurens@han.nl" && allUsers[i].email != "debbie.tarenskeen@han.nl" && allUsers[i].email != "test@han.nl"){
                    userRow = "<div class='userForAdmin'>" +
                                "<p>";
                    if (allUsers[i].insertion == null || allUsers[i].insertion == ""){
                        userRow += "<div class='userAdminNameInsertionLastName'>"+allUsers[i].name+" "+allUsers[i].lastName+"</div>" +
                            "<div class='userAdminEmail'>"+allUsers[i].email+"</div>";
                            // "<div class='userAdminEmail'>tozz</div>";
                    } else{
                        userRow += "<div class='userAdminNameInsertionLastName'>"+allUsers[i].name+" "+allUsers[i].insertion+" "+allUsers[i].lastName+"</div>" +
                            "<div class='userAdminEmail'>"+allUsers[i].email+"</div>";
                    }
                if(allUsers[i].authorized === '1') {
                    userRow +=  "<label id='"+allUsers[i].email+"' onchange='enableDisableUser(id)' class='switch'>" +
                                "<input checked type='checkbox'>" +
                                    "<span class='slider round'></span>" +
                                        "<div class='userAuthorized'>" + allUsers[i].authorized + "</div>" +
                                        "<div hidden class='userAdminNameInsertionLastName'>"+allUsers[i].name+"</div>" +
                                        "<div hidden class='emailRecieved'>"+allUsers[i].recieverEmail+"</div>" +
                                "</label>";
                }else {
                    userRow +=  "<label id='"+allUsers[i].email+"' onchange='enableDisableUser(id)' class='switch'>" +
                                    "<input type='checkbox'>" +
                                        "<span class='slider round'></span>" +
                                            "<div class='userAuthorized'>" + allUsers[i].authorized + "</div>" +
                                            "<div hidden class='userAdminNameInsertionLastName'>"+allUsers[i].name+"</div>" +
                                            "<div hidden class='emailRecieved'>"+allUsers[i].recieverEmail+"</div>" +
                                "</label>";
                }
                userRow +=      "</p>" +
                            "</div>";

                users.innerHTML += userRow;
                }
            }
        }
    });
}

//Search in News items
function searchUsers(){
    var search = jQuery("#searchUsers").val();
    resetSearch();
    var resultCount = false;
    for(var i = 0; i < document.getElementsByClassName("userForAdmin").length; i++){
        if(document.getElementsByClassName("userForAdmin")[i].childNodes[1].innerHTML.toLowerCase().indexOf(search.toLowerCase()) == -1 &&
           document.getElementsByClassName("userForAdmin")[i].childNodes[2].innerHTML.toLowerCase().indexOf(search.toLowerCase()) == -1 ){
            document.getElementsByClassName("userForAdmin")[i].style.display = "none";
        }else{
            resultCount = true;
        }
    }
    if(resultCount == false){
        document.getElementById("noSearchResults").innerHTML = "Geen resultaten gevonden";
    }
}

//Reset the search bar
function resetSearch(){
    document.getElementById("noSearchResults").innerHTML = "";
    for(var i = 0; i < document.getElementsByClassName("userForAdmin").length; i++){
        document.getElementsByClassName("userForAdmin")[i].style.display = "";
    }
}


//Set new authorize value in selected user
function enableDisableUser(email){
    var currentAuthorizeStates = document.getElementById(email).getElementsByClassName("userAuthorized")[0];
    var emailStatus = document.getElementById(email).getElementsByClassName("emailRecieved")[0];
    var name = document.getElementById(email).getElementsByClassName("userAdminNameInsertionLastName")[0];
    if (currentAuthorizeStates.innerHTML === '1'){
        jQuery.ajax({
            method: "POST",
            data: {
                'setAuthorizeStatus': true,
                "email": email,
                "authorized": 0
            },
            url: databaseActivities,
            success: function (result){
                showToast(email + ' heeft geen toegang');
                currentAuthorizeStates.innerHTML = '0';
            }
        });
    }else{
        jQuery.ajax({
            method: "POST",
            data: {
                'setAuthorizeStatus': true,
                "email": email,
                "authorized": 1
            },
            url: databaseActivities,
            success: function (result){
               sendFirstEmail(email, emailStatus, name);
                showToast(email + ' heeft toegang');
                currentAuthorizeStates.innerHTML = '1';
            }
        });
    }
}


//an mail will be sent for the first time if the administrator enabled the current user account
function sendFirstEmail(email, emailStatus, name){
    if (emailStatus.innerHTML === '0'){
        jQuery.ajax({
            method: "POST",
            data: {
                'recieveAuthorizedMail': true,
                "email": email,
                "name": name.innerHTML,
                "url": baseLink
            },
            url: databaseActivities,
            success: function (result){
                emailStatus.innerHTML = '1';
            }
        });
    }
}


//Shows an response message
var timer;
function showToast(message){
    var snackbar = document.getElementById("snackbar");
    snackbar.innerHTML = message;
    snackbar.className = "show";
    timer = setTimeout(function(){ snackbar.className = ""; }, 1200);
}


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
            }else{
                var userValues = JSON.parse(result);
                var fullName = userValues[0].name +" "+ userValues[0].insertion +" "+ userValues[0].lastName;;
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
                stuffDiv.innerHTML += "<div class='optionClassText' onclick='changePass();'>Wachtwoord wijzigen</div>";
                stuffDiv.innerHTML += "<button class='buttonLogOut' onclick='logOut();'>Uitloggen</button>";
            }
        });
}


function logOut(){
    jQuery.ajax({
        method: "POST",
        data: {
            'logOut': true
        },
        url: databaseActivities,
        success: function (result) {
            window.open(baseLink,"_self");
        }
    });
}


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
            window.open(changePasswordPage, "_self");
        }
    });
}

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
			window.open(adminPage, "_self");
        }
    });

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
            window.open(myVideos, "_self");
        }
    });
}
