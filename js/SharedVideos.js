'use strict';

var baseLink = "https://www.KVH.nl/";
var databaseActivities = baseLink + "db/DatabaseActivities.php";
var changePasswordPage = baseLink + "pages/ChangePassword.html";
var adminPage = baseLink + "pages/Administrator.html";

jQuery( document ).ready(function() {
    document.getElementById("sharedVideosMenu").className = "menuItem selectedMenu";
    jQuery('#mainDivMyVideos').bind('contextmenu',function() { return false; });
});

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
            window.open(baseLink+"pages/"+page,"_self");
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
                getSharedMoviesFromCurrentUser();
            }
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

function getSharedMoviesFromCurrentUser(){
    jQuery.ajax({
        method: "POST",
        data: {
            'getSharedUserVideos': true
        },
        url: databaseActivities,
        success: function (result) {
            var userVideos = JSON.parse(result);
            getLatestCheck(userVideos);
        }
    });
}

function getLatestCheck(userVideos){
    jQuery.ajax({
        method: "POST",
        data: {
            'getUserLastCheck': true
        },
        url: databaseActivities,
        success: function (result) {
            var date = JSON.parse(result);
            createVideoDiv(userVideos, date);
            updateUserLastCheck();
        }
    });
}

function updateUserLastCheck(){
    jQuery.ajax({
        method: "POST",
        data: {
            'updateUserLastCheck': true,
            'timestamp': (new Date).getTime()
        },
        url: databaseActivities,
        success: function (result) {

        }
    });
}

function createVideoDiv (videoObj, date){
    var mainDiv = document.getElementById('mainDiv');
    var currentEmail = "";
    var videoContent = "";
    var currentVideoCount = 0;
    var maxVideoCount = 4;
    var vids = [];
    var divCount = 0;
    for(var i = 0 ; i < videoObj.length ; i++){
        var video = document.createElement("video");
        video.id = videoObj[i].id;
        video.src = baseLink + videoObj[i].videoUrl;
        vids.push(video);
        if(videoObj[i].email != currentEmail){
            if(currentEmail != ''){
                if(currentVideoCount > maxVideoCount){
                    videoContent += "<div class='showMoreVideos' onclick=\"showMoreVideos('"+currentEmail+"')\"><h4>Bekijk meer</h4></div>";
                }
                videoContent += "</div>";
            }
            currentVideoCount = 0;
            videoContent += "<div class='caseTitle'><h3>" + videoObj[i].name +" "+ videoObj[i].insertion + " " + videoObj[i].lastName + "</h3></div><div id='" + videoObj[i].email + "' class='caseVideos'>";
        }
        var questionWord = "vragen";
        if(videoObj[i].openQuestionCount == 1){
            questionWord = "vraag";
        }
        var markerWord = "markeringen";
        if(videoObj[i].markerCount == 1){
            markerWord = "markering";
        }
        var className = "videoDiv";
        currentVideoCount++;
        if(currentVideoCount > maxVideoCount){
            className = "videoDiv hiddenVid";
        }
        var isNew = "";
        if(videoObj[i].timestamp > date[0].lastCheck){
            isNew = "<div class='isNew'>*</div>";
        }
        videoContent += "<div id='"+videoObj[i].id+"' class='"+className+"' onclick='pressVideo(id)'>"+isNew+"<div class='videoTitle'><h4>"+videoObj[i].title+"</h4></div>";
        if(videoObj[i].openQuestionCount != 0){
            videoContent += "<div class='videoThumbnail'></div><div class='thumbnailOverlay' onclick='showStats("+videoObj[i].id+","+divCount+");cancelBubble(event);'><div class='unanswered'><div class='unansweredIcon'>"+videoObj[i].totalMarkers+"</div></div><p class='overlayText'>kijkvragen</p><div class='statsDropdownIcon'></div><div class='stats'></div></div></div>";
        }else{
            videoContent += "<div class='videoThumbnail'></div><div class='thumbnailOverlay' onclick='showStats("+videoObj[i].id+","+divCount+");cancelBubble(event);'><div class='unanswered'><div class='unansweredIconDone'>"+videoObj[i].totalMarkers+"</div></div><p class='overlayTextDone'>alle kijkvragen toegepast</p><div class='statsDropdownIcon'></div><div class='stats'></div></div></div>";
        }
        divCount++;
        currentEmail = videoObj[i].email;
    }
    addThumbnails(vids);
    mainDiv.innerHTML = videoContent;
    if(currentVideoCount > maxVideoCount){
        document.getElementById(currentEmail).innerHTML += "<div class='showMoreVideos' onclick=\"showMoreVideos('"+currentEmail+"')\"><h4>Bekijk meer</h4></div>";
    }
}

function cancelBubble(e) {
 var evt = e ? e:window.event;
 if (evt.stopPropagation)    evt.stopPropagation();
 if (evt.cancelBubble!=null) evt.cancelBubble = true;
}

function showStats(videoId, count){
    if(document.getElementsByClassName("stats")[count].innerHTML == ""){
        jQuery.ajax({
          method: "POST",
          data: {
              'getVideoQuestionStats': true,
              'videoId': videoId
          },
          url: databaseActivities,
          success: function (result) {
            var stats = JSON.parse(result);
            for(var i = 0; i < stats.length; i++){
                if(stats[i].category != null){
                    var statRow = "";
                    statRow = "<div class='statRow'><div class='statCount'><div class='statCountIcon'>"+stats[i].count+"</div></div><p class='statCategory'>"+stats[i].category+"</p></div>";
                    document.getElementsByClassName("stats")[count].innerHTML += statRow;
                }
            }
            document.getElementsByClassName("statsDropdownIcon")[count].style.backgroundImage = "url(../img/icon_rood_up.png)";
            document.getElementsByClassName("stats")[count].style.padding = "3%";
          }
      });
    }else{
        document.getElementsByClassName("statsDropdownIcon")[count].style.backgroundImage = "url(../img/icon_rood_down.png)";
        document.getElementsByClassName("stats")[count].innerHTML = "";
        document.getElementsByClassName("stats")[count].style.padding = "0%";
    }
}

function showMoreVideos(currentCase){
    var hiddenVids = document.getElementById(currentCase).getElementsByClassName("hiddenVid");
    var initLength = document.getElementById(currentCase).getElementsByClassName("hiddenVid").length;
    if(initLength > 0){
        for(var i = 0; i < initLength; i++){
            hiddenVids[0].className = "videoDiv shownVid";
        }
        document.getElementsByClassName("showMoreVideos")[0].innerHTML = "<h4>Bekijk minder</h4>";
    }else{
        var shownVids = document.getElementById(currentCase).getElementsByClassName("shownVid");
        var initLength = document.getElementById(currentCase).getElementsByClassName("shownVid").length;
        for(var i = 0; i < initLength; i++){
            shownVids[0].className = "videoDiv hiddenVid";
        }
        document.getElementsByClassName("showMoreVideos")[0].innerHTML = "<h4>Bekijk meer</h4>";
    }

}

function addThumbnails(vids){
    console.log(vids);
    for(var i = 0; i < vids.length; i++){
        vids[i].addEventListener('loadeddata', function(event) {
            console.log("load");
            event.target.currentTime = 1;
        }, false);

        vids[i].addEventListener('seeked', function(event) {
            console.log("seek");
            generateThumbnail(event.target);
        }, false);
    }
    console.log("listeners set");
}

function generateThumbnail(video) {
    var c = document.createElement("canvas");
    var ctx = c.getContext("2d");
    c.width = 260;
    c.height = 160;
    ctx.drawImage(video, 0, 0, c.width, c.height);
    var thumbnail = document.getElementById(video.id).getElementsByClassName("videoThumbnail")[0];
    thumbnail.appendChild(c);
}

function pressVideo(videoId){
    jQuery.ajax({
        method: "POST",
        data: {
            'setCorrectSession': true
        },
        url: databaseActivities,
        dataType: "json",
        success: function (result) {
          jQuery.ajax({
              method: "POST",
              data: {
                  'setVideoId': true,
                  'videoId': videoId
              },
              url: databaseActivities,
              success: function (result) {
                  window.open(baseLink+"pages/Details.html","_self");
              }
          });
        }
    });
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
