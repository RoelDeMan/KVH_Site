'use strict';
var baseLink = "https://www.KVH.nl/";
var overviewPage = "https://www.KVH.nl/pages/MyVideos.html";
var databaseActivities = baseLink + "db/DatabaseActivities.php";
var changePasswordPage = baseLink + "pages/ChangePassword.html";
var adminPage = baseLink + "pages/Administrator.html";


jQuery( document ).ready(function() {
    document.getElementById("myVideosMenu").className = "menuItem selectedMenu";
    //jQuery('#mainDivMyVideos').bind('contextmenu',function() { return false; });
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
        }
    });
  window.open(baseLink+"pages/"+page,"_self");
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
                getMoviesFromCurrentUser();
            }
        }
    });
}

function autoLogOut(){
     jQuery.ajax({
        method: "POST",
        data: {
            'logOut': true
        },
        url: databaseActivities,
        success: function (result) {
            console.log("fsldkngsodlngsdklghnfklhgdnsdlktngw");
            console.log("great succes");
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

function getMoviesFromCurrentUser(){
    jQuery.ajax({
        method: "POST",
        data: {
            'getUserVideos': true
        },
        url: databaseActivities,
        success: function (result) {
            var userVideos = JSON.parse(result);
            createVideoDiv(userVideos);
            getSharedCount();
        }
    });
}

function getSharedCount(){
    jQuery.ajax({
        method: "POST",
        data: {
            'getSharedUserVideosCount': true
        },
        url: databaseActivities,
        success: function (result) {
            var sharedVideos = JSON.parse(result);
            if(sharedVideos.length != 0){
                document.getElementsByClassName("sharedCount")[0].innerHTML = sharedVideos.length;
                document.getElementsByClassName("sharedCount")[0].style.display = "block";
            }
        }
    });
}

function createVideoDiv (videoObj){
    var mainDiv = document.getElementById('mainDivMyVideos');
    var currentCase = "";
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
        if(videoObj[i].casename != currentCase){
          if(currentVideoCount == maxVideoCount){
              videoContent += "<div class='showMoreVideos' onclick=\"showMoreVideos('"+currentCase+"')\"><h4>Bekijk meer</h4></div>";
          }
            if(currentCase != ''){
                videoContent += "</div>";
            }
            currentVideoCount = 0;
            videoContent += "<div class='caseTitle'><h3>"+videoObj[i].casename+"</h3></div><div id='"+videoObj[i].casename+"' class='caseVideos'>";
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
        videoContent += "<div id='"+videoObj[i].id+"' class='"+className+"' onclick='pressVideo(id)'><div class='videoTitle'><h4>"+videoObj[i].title+"</h4><div class='deleteVideoDiv'><div id="+videoObj[i].id+" class='deleteVideo' onClick='deleteVideo(id);cancelBubble();'></div></div></div>";
        if(videoObj[i].openQuestionCount != 0){
            videoContent += "<div class='videoThumbnail'></div><div class='thumbnailOverlay' onclick='showStats("+videoObj[i].id+","+divCount+");cancelBubble(event);'><div class='unanswered'><div class='unansweredIcon'>"+videoObj[i].totalMarkers+"</div></div><p class='overlayText'>kijkvragen</p><div class='statsDropdownIcon'></div><div class='stats'></div></div></div>";
        }else{
            videoContent += "<div class='videoThumbnail'></div><div class='thumbnailOverlay' onclick='showStats("+videoObj[i].id+","+divCount+");cancelBubble(event);'><div class='unanswered'><div class='unansweredIconDone'>"+videoObj[i].totalMarkers+"</div></div><p class='overlayTextDone'>alle kijkvragen toegepast</p><div class='statsDropdownIcon'></div><div class='stats'></div></div></div>";
        }
        divCount++;
        //<p class='upperOverlay'>"+videoObj[i].openQuestionCount+" onbeantwoorde "+questionWord+"</p><p class='underOverlay'>"+videoObj[i].markerCount+" "+markerWord+" in totaal</p>
        currentCase = videoObj[i].casename;
        console.log(i);
        if(i+1 == videoObj.length){
          videoContent += "<div class='showMoreVideos' onclick=\"showMoreVideos('"+currentCase+"')\"><h4>Bekijk meer</h4></div>";
        }
    }
    addThumbnails(vids);
    mainDiv.innerHTML = videoContent;
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


function cancelBubble(e) {
 var evt = e ? e:window.event;
 if (evt.stopPropagation)    evt.stopPropagation();
 if (evt.cancelBubble!=null) evt.cancelBubble = true;
}

function deleteVideo(videoId){
    console.log(videoId);
    var con = confirm("Weet u zeker dat u deze video wilt verwijderen?");
    if(con == true){
        jQuery.ajax({
          method: "POST",
          data: {
              'deleteVideo': true,
              'videoId': videoId
          },
          url: databaseActivities,
          success: function (result) {
            console.log("bevestigd");
            window.open(overviewPage, "_self");
          }
      });
    }
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
            console.log(result);
            jQuery.ajax({
              method: "POST",
              data: {
                  'setVideoId': true,
                  'videoId': videoId
              },
              url: databaseActivities,
              success: function (result) {
                  window.open(baseLink + "pages/Details.html","_self");
              }
          });
        }
    });
}

function openAndAddVideoForm(){
    var addVideoForm =  "<form id='newVideoForm' name='newVideoForm' action='"+databaseActivities+"' method='post' enctype='multipart/form-data'>" +
                            "<input hidden id='addVideo' name='addVideo' value=true>" +
                            "<input id='newVideo' type='file' name='newVideo' accept='video/*'>" +
                            "<input id='newVideoTitle' placeholder='Titel' name='videoTitle' type='text'>" +
                            "<input id='videoDescription' placeholder='Bijschrift' name='videoDescription' type='text'>" +
                            "<input type='submit' name='insertNewVideo'>Voeg toe" +
                        "</form>";
    var addVideoDiv = document.getElementById('addVideoForm');
    var addButton = document.getElementById('addNewVideo');
        addVideoDiv.style.display = 'inline';
        addButton.style.display = 'none';
        addVideoDiv.innerHTML = addVideoForm;
}

function closeDrawer(){
    document.getElementById("optionsDrawer").innerHTML = "";
    document.getElementById("closeDrawer").style.display = "none";
}

function openShareForm(){
    var svgtje = '<svg version=\'1.1\' class=\'sharedImg\' xmlns=\'http://www.w3.org/2000/svg\' xmlns:xlink=\'http://www.w3.org/1999/xlink\' x=\'0px\' y=\'0px\' viewBox=\'0 0 248.349 248.349\' xml:space=\'preserve\'>' +
                      '<path class=\'sharedImg\' d=\'M9.954,241.305h228.441c3.051,0,5.896-1.246,7.805-3.416c1.659-1.882,2.393-4.27,2.078-6.723c-5.357-41.734-31.019-76.511-66.15-95.053c-14.849,14.849-35.348,24.046-57.953,24.046s-43.105-9.197-57.953-24.046C31.09,154.65,5.423,189.432,0.071,231.166c-0.315,2.453,0.424,4.846,2.078,6.723C4.058,240.059,6.903,241.305,9.954,241.305z\'/>' +
                      '<path class=\'sharedImg\' d=\'M72.699,127.09c1.333,1.398,2.725,2.73,4.166,4.019c12.586,11.259,29.137,18.166,47.309,18.166s34.723-6.913,47.309-18.166c1.441-1.289,2.834-2.622,4.166-4.019c1.327-1.398,2.622-2.828,3.84-4.329c9.861-12.211,15.8-27.717,15.8-44.6c0-39.216-31.906-71.116-71.116-71.116S53.059,38.95,53.059,78.16c0,16.883,5.939,32.39,15.8,44.6C70.072,124.262,71.366,125.687,72.699,127.09z\'/>' +
                  '</svg>';
    var shareForm = "<div id='network'><div class='sharedTitle'><h3>Mensen die mee kunnen kijken:</h3></div><div id='sharedUsers'>";
    jQuery.ajax({
        method: "POST",
        data: {
            'getMyShares': true
        },
        url: databaseActivities,
        success: function (result) {
            var sharedUsers = JSON.parse(result);
            for(var i = 0; i < sharedUsers.length; i++){
                var fullName = sharedUsers[i].name;
                fullName += " " + sharedUsers[i].insertion;
                fullName += " " + sharedUsers[i].lastName;
                shareForm += "<div class='sharedUser'><div class='sharedUserIconDiv'><div class='sharedUserIcon'>"+svgtje+"</div></div><div class='sharedUserName'>"+fullName+"</div>";
                shareForm += "<div class='deleteSharedUser'><div id='"+sharedUsers[i].viewerEmail+"' class='deleteSharedUserIcon' onclick='deleteSharedUser(id)'></div></div></div>";
            }
            shareForm += "</div>";
            shareForm += "<div id='addSharedUser'><div class='addSharedUserTitle'><h3>Uitnodigen</h3></div><input id='sharedUserAutocomplete' placeholder='Typ hier een naam'></div>";
            shareForm += "</div>";
            shareForm += "<div class='supportText'><p>Alle personen in deze lijst kunnen meekijken met al uw video's. Zij kunnen beelden van u bekijken en uw vragen beantwoorden. <br><br>Houdt u er in verband met privacy rekening mee dat u uw video's niet met onbekenden deelt.</p>";
            shareForm += "<p>Wilt u uw netwerk uitbreiden? Dat kan door een uitnodiging te versturen naar &eacute;&eacute;n of meer personen. De betreffende personen kunnen zich na uw uitnodiging registreren, waarna de beheerder de personen toegang geeft tot de videobeelden.</p></div>"
            document.getElementById("optionsDrawer").innerHTML = shareForm;
            document.getElementById("closeDrawer").style.display = "block";
            populateInviteField();
        }
    });
}

function populateInviteField(){
    jQuery.ajax({
        method: "POST",
        data: {
            'getNotShared': true
        },
        url: databaseActivities,
        success: function (result) {
            var notSharedUsers = JSON.parse(result);
            jQuery( function() {
                var availableTags = [];
                for(var i = 0; i < notSharedUsers.length; i++){
                    var fullName = notSharedUsers[i].name;
                    fullName += " " + notSharedUsers[i].insertion;
                    fullName += " " + notSharedUsers[i].lastName;
                    availableTags.push({label: fullName, value: notSharedUsers[i].email});
                }
                jQuery( "#sharedUserAutocomplete" ).autocomplete({
                    source: availableTags,
                    select: function(event, ui) {
                        addSharedUser(ui.item.value);
                    }
                });
            });
        }
    });
}

function addSharedUser(email){
    jQuery.ajax({
        method: "POST",
        data: {
          'addSharedUser': true,
          'viewerEmail': email
        },
        url: databaseActivities,
        success: function (result) {
            openShareForm();
            showToast("Gebruiker toegevoegd aan netwerk");
        }
    });
}

function deleteSharedUser(email){
    jQuery.ajax({
        method: "POST",
        data: {
          'deleteSharedUser': true,
          'viewerEmail': email
        },
        url: databaseActivities,
        success: function (result) {
            openShareForm();
            showToast("Gebruiker verwijderd uit netwerk");
        }
    });
}

function openUploadForm(){
    var uploadForm = "<div id='upload'>" +
                        "<div class='uploadHeaderTitle'>" +
                            "<h3>Video uploaden</h3>" +
                        "</div>" +
                            "<div id='uploadInputDivBox' onchange='fetchname()'>"+
                                "<input hidden id='addVideo' name='addVideo' value=true>" +
                                "<input id='newVideo' type='file' name='newVideo' onclick='resetOnchangeValue();' accept='video/*'>" +
                                    "<div id='uploadFileDivLabel'>" +
                                        "<label for='newVideo' id='uploadFileLabel'>" +
                                            "Kies bestand..." +
                                        "</label>" +
                                    "</div><div id='videoValidResult' class='errorResult'></div>" +
                                "<input type='text' name='videoTitle' id='newVidTitle' class='inputUploadDiv' placeholder='Titel'><div id='newVidTitleValidResult' class='errorResult'></div>" +
                                "<textarea name='videoDescription' id='videoDescription' class='inputUploadTextarea' placeholder='Beschrijving'></textarea><div id='videoDescriptionValidResult' class='errorResult'></div>" +
                                "<input id='casesAutocomplete' name='videoCaseId'  placeholder='Naam cli&euml;nt'><div id='caseAutocompleteValidResult' class='errorResult'></div>" +
                            "</div>" +
                            "<div id='insertUploadButton'><input type='submit' id='uploadSaveButton' onclick='saveNewVideo();' value='Opslaan'></div>" +
                        "<div id='status1'></div>" +
                        "<div id='status2'></div>" +
                        "<div id='spinner'></div>" +
                    "</div>" +
                    "<div class='supportText'><p>Het systeem accepteert enkel .mp4-bestanden van maximaal 3 GB.</p>" +
                    "<p>Lukt het uploaden van een video niet? Houdt u er rekening mee dat het uploaden langer kan duren op een langzame verbinding."+
					"<br><br>Lukt het uploaden nog steeds niet? Neem contact op met Annica Brummel: annica.brummel@han.nl</p>" +
                    "</div>";

    document.getElementById("optionsDrawer").innerHTML = uploadForm;
    document.getElementById("closeDrawer").style.display = "block";

    populateCaseField();
}

function populateCaseField(){
    jQuery.ajax({
        method: "POST",
        data: {
            'getCases': true
        },
        url: databaseActivities,
        success: function (result) {
            var cases = JSON.parse(result);
            jQuery( function() {
                var availableTags = [];
                for(var i = 0; i < cases.length; i++){
                    availableTags.push({label: cases[i].name, value: cases[i].id});
                }
                jQuery( "#casesAutocomplete" ).autocomplete({
                    source: availableTags,
                    select: function(event, ui) {
                        event.preventDefault();
                        document.getElementById("casesAutocomplete").value = ui.item.label;
                    }
                });
            });
        }
    });
}

function resetOnchangeValue(){
    var newVideo = document.getElementById('newVideo');
    var videoTitle = document.getElementById('newVidTitle');
    var videoDescription = document.getElementById('videoDescription');
    newVideo.value = null;
}

//Fetch filename and put it in filelabel
function fetchname(){
    var videoTitle = document.getElementById('newVidTitle');
    var videoDescription = document.getElementById('videoDescription');
    var newVideo = document.getElementById('newVideo').value;
    var resultPercent = document.getElementById('status1');
    var resultText = document.getElementById('status2');
    var resultSelectedVideo = document.getElementById('uploadFileLabel');
    var insertUploadButton = document.getElementById('insertUploadButton');
        if(newVideo.length === 0 || newVideo === "" || newVideo === null) {
            resultSelectedVideo.innerHTML = 'Kies bestand...';
            insertUploadButton.style.display = 'none';
            insertUploadButton.style.display = "none";
            resultPercent.innerHTML = "";
            resultText.innerHTML = "";
        }else{
            var file = newVideo.split("\\");
            var fileName = file[file.length-1];
            resultSelectedVideo.innerHTML = fileName;
            insertUploadButton.style.display = 'inline';
            insertUploadButton.style.display = "block";
            resultPercent.innerHTML = "";
            resultText.innerHTML = "";
        }
}

function checkTitle(){
    var videoTitle = document.getElementById('newVidTitle').value;
    var border = document.getElementById('newVidTitle');
    var result = document.getElementById("newVidTitleValidResult");
    if(videoTitle.length == 0 || videoTitle == "" || videoTitle == null){
        result.innerHTML = 'Vul een titel in';
        result.style.color = '#FF7888';
        border.style.borderColor = '#FF7888';
        return false;
    }else{
        result.innerHTML = '';
        border.style.borderColor = '#1387B9';
        return true;
    }
}

function checkDescription(){
    var videoDescription = document.getElementById('videoDescription').value;
    var border = document.getElementById('videoDescription');
    var result = document.getElementById("videoDescriptionValidResult");
    if(videoDescription.length == 0 || videoDescription == "" || videoDescription == null){
        result.innerHTML = 'Vul een beschrijving in';
        result.style.color = '#FF7888';
        border.style.borderColor = '#FF7888';
        return false;
    }else{
        result.innerHTML = '';
        border.style.borderColor = '#1387B9';
        return true;
    }
}

function checkCase(){
    var casesAutocomplete = document.getElementById('casesAutocomplete').value;
    var border = document.getElementById('casesAutocomplete');
    var result = document.getElementById("caseAutocompleteValidResult");
    if(casesAutocomplete.length == 0 || casesAutocomplete == "" || casesAutocomplete == null){
        result.innerHTML = 'Voeg een cli&euml;ntnaam toe';
        result.style.color = '#FF7888';
        border.style.borderColor = '#FF7888';
        return false;
    }else{
        result.innerHTML = '';
        border.style.borderColor = '#1387B9';
        return true;
    }
}

function checkVideo(){
	var result;
    var size = jQuery('#newVideo')[0].files[0].size;
    console.log(size);
    //https://www.eenheden-omrekenen.info/eenhedenrekenmachine.php?type=bytes
	//var maxSize = 786432000; // 750 MB
	//var maxSize =  1073741824; // 1 GB
    //var maxSize =  2147483648; // 2 GB
    var maxSize = 3221225472; // 3 GB

    var type = jQuery('#newVideo')[0].files[0].type;
    console.log(type);
    var allowedTypes = ["video/mp4", "video/mpeg"];

    if(size > maxSize){
        var check = document.getElementById("videoValidResult");
        check.style.color = "#FF7888";
        var test = size / 1024 / 1024;
        check.innerHTML = "De video is te groot (" + test.toFixed(1) + " MB)";
        result = false;
    }else if(type != allowedTypes[0] &&  type != allowedTypes[1]){
        console.log(type);
        if(type == "" || type == null || type == undefined){
            console.log(jQuery('#newVideo')[0].files[0].name.substr(jQuery('#newVideo')[0].files[0].name.length-4, jQuery('#newVideo')[0].files[0].name.length));
            if(jQuery('#newVideo')[0].files[0].name.substr(jQuery('#newVideo')[0].files[0].name.length-4, jQuery('#newVideo')[0].files[0].name.length).toLowerCase() == ".mp4"){
                result = true;
                var check = document.getElementById("videoValidResult");
                check.innerHTML = "";
            }else{
                console.log("Is geen type mp4");
                var check = document.getElementById("videoValidResult");
                check.style.color = "#FF7888";
                check.innerHTML = "De video is geen mp4";
                result = false;
            }
        }else{
            console.log("Eindigt niet op mp4");
            var check = document.getElementById("videoValidResult");
            check.style.color = "#FF7888";
            check.innerHTML = "De video is geen mp4";
            result = false;
        }
    }else{
    	result = true;
    	var check = document.getElementById("videoValidResult");
        check.innerHTML = "";
    }
    return result;
}

var ajax = new XMLHttpRequest();

function saveNewVideo() {
    checkTitle();
    checkDescription();
    checkCase();
    checkVideo();
    if(checkTitle() == true && checkDescription() == true && checkCase() == true && checkVideo() == true){
        checkedVideo();
    }
}

function checkedVideo(){
    var insertUploadButton = document.getElementById('insertUploadButton');
    var videoTitle = document.getElementById('newVidTitle');
    var videoDescription = document.getElementById('videoDescription');
    var videoCaseId = document.getElementById('casesAutocomplete');
    var file = document.getElementById('newVideo').files[0];
    var formdata = new FormData();
        formdata.append('addVideo', true);
        formdata.append('newVideo', file);
        formdata.append('videoTitle', videoTitle.value);
        formdata.append('videoDescription', videoDescription.value);
        formdata.append('videoCaseId', videoCaseId.value);
        formdata.append('timestamp', (new Date).getTime());

    ajax.upload.addEventListener("progress", progressHandler, false);
    ajax.addEventListener("load", completeHandler, false);
    ajax.addEventListener("error", errorHandler, false);
    ajax.addEventListener("abort", abortHandler, false);
    ajax.open("POST", databaseActivities, true);
    ajax.send(formdata);

    var resultPercent = document.getElementById('status1');
    resultPercent.innerHTML = 'Uploaden...';

    var cancelButton = "<input type='button' id='uploadSaveButton' onclick='abortHandler();' value='Annuleer'>" +
        "<div id='progressbar'><div id='progress'><div id='pbaranim'><div id='status'></div></div></div>";
    insertUploadButton.innerHTML = cancelButton;
}

function progressHandler(event) {
    var resultPercent = document.getElementById('status1');
    var percent = (event.loaded / event.total) * 100;
    resultPercent.innerHTML = Math.round(percent)+'%';
    document.body.style.setProperty("--progress-bar-width", Math.round(percent)+'%');
    if(Math.round(percent) == 100){
        var loader = "<div class='loader'></div>";
        document.getElementById("spinner").innerHTML = loader;
    }
}

var newVideo = 0;
function completeHandler() {
    var videoTitle = document.getElementById('newVidTitle');
    var videoDescription = document.getElementById('videoDescription');
    var resultPercent = document.getElementById('status1');
    var resultText = document.getElementById('status2');
    var uploadAnimation = document.getElementById('pbaranim');
    var progress = document.getElementById('progress');
    resultText.innerHTML = "Het uploaden is gelukt";
    uploadAnimation.style.background = 'none';
    resultPercent.value = '';
    progress.style.width = 0;
    newVideo = JSON.parse(this.responseText);
    console.log(this.responseText);
    setTimeout(function(){
        console.log(newVideo[0].id);
        pressVideo(newVideo[0].id);
    }, 2000);
}

function errorHandler() {
    var resultText = document.getElementById('status2');
    var uploadAnimation = document.getElementById('pbaranim');
    resultText.innerHTML = "Het uploaden is mislukt";
    uploadAnimation.style.background = 'none';
    ajax.abort();
}

function abortHandler() {
    var resultText = document.getElementById('status2');
    var uploadAnimation = document.getElementById('pbaranim');
    resultText.innerHTML = "Het uploaden is geannuleerd";
    uploadAnimation.style.background = 'none';
    ajax.abort();
	setTimeout(function(){
		openUploadForm();
	}, 3000);
}

//Show a pop-up message (toast) when an action is performed that doesn't load a full page
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
