'use strict';
var player;
var video;
var markers;
var currentUser;
var selectedQuestions = [];
var baseLink = "https://www.KVH.nl/";
var databaseActivities = baseLink + "db/DatabaseActivities.php";
var changePasswordPage = baseLink + "/pages/ChangePassword.html";
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

var infoDetails = [
    "<b>Allieren</b> <br>" +
    "Meevoelend verbinden (sympathie): <br>" +
    "&nbsp;&nbsp;&nbsp;- Persoonskenmerken benoemen <br>" +
    "&nbsp;&nbsp;&nbsp;- Relatie benoemen <br>" +
    "&nbsp;&nbsp;&nbsp;- Praten over dagelijkse dingen <br>" +
    "&nbsp;&nbsp;&nbsp;- Iets over jezelf vertellen <br>" +
    "&nbsp;&nbsp;&nbsp;- Blik van verstandhouding <br>" +
    "&nbsp;&nbsp;&nbsp;- Humor inzetten <br>" +
    "Zich verplaatsend in een ander verbinden (empathie): <br>" +
    "&nbsp;&nbsp;&nbsp;- Snappen dat het belangrijk voor iemand is <br>" +
    "&nbsp;&nbsp;&nbsp;- Zeggen dat je iets begrijpt <br>" +
    "&nbsp;&nbsp;&nbsp;- Rekening houden met de ander <br>" +
    "Taakgericht verbinden: <br>" +
    "&nbsp;&nbsp;&nbsp;- Afspraak maken <br>" +
    "&nbsp;&nbsp;&nbsp;- Ieders verantwoordelijkheid bespreken <br>" +
    "&nbsp;&nbsp;&nbsp;- Overeenstemmen wat moet gebeuren <br>" +
    "&nbsp;&nbsp;&nbsp;- Een voorstel vragen of er mee komen <br>"
    ,
    "<b>Aansluiten</b> <br>" +
    "Actief luisterend aansluiten: <br>" +
    "&nbsp;&nbsp;&nbsp;- Open vragen stellen <br>" +
    "&nbsp;&nbsp;&nbsp;- Doorvragen <br>" +
    "&nbsp;&nbsp;&nbsp;- Aansluiten bij verhaal gesprekspartner <br>" +
    "&nbsp;&nbsp;&nbsp;- Oogcontact maken <br>" +
    "&nbsp;&nbsp;&nbsp;- Hummen <br>" +
    "&nbsp;&nbsp;&nbsp;- Stiltes laten vallen <br>" +
    "Tactisch aansluiten: <br>" +
    "&nbsp;&nbsp;&nbsp;- Samen probleem formuleren <br>" +
    "&nbsp;&nbsp;&nbsp;- Op een lijn komen <br>" +
    "&nbsp;&nbsp;&nbsp;- Op het juiste moment iets inbrengen <br>" +
    "&nbsp;&nbsp;&nbsp;- Samen analyseren <br>" +
    "&nbsp;&nbsp;&nbsp;- Klopt het dat <br>" +
    "&nbsp;&nbsp;&nbsp;- Op een rijtje zetten <br>" +
    "Doelgericht aansluiten: <br>" +
    "&nbsp;&nbsp;&nbsp;- Afspraken nakomen/bewaken <br>" +
    "&nbsp;&nbsp;&nbsp;- Gebruik maken van dossierkennis <br>" +
    "&nbsp;&nbsp;&nbsp;- Proces bewaken <br>"
    ,
    "<b>Aanspreken</b> <br>" +
    "Waarderend (partijdig) aanspreken: <br>" +
    "&nbsp;&nbsp;&nbsp;- Compliment geven <br>" +
    "&nbsp;&nbsp;&nbsp;- Excuses aanbieden <br>" +
    "&nbsp;&nbsp;&nbsp;- De situatie beoordelen <br>" +
    "Meervoudig partijdig aanspreken: <br>" +
    "&nbsp;&nbsp;&nbsp;- Ander perspectief inbrengen <br>" +
    "&nbsp;&nbsp;&nbsp;- Andere informatie inbrengen <br>" +
    "&nbsp;&nbsp;&nbsp;- Stel-dat-vragen (circulair navragen) <br>" +
    "Resultaatgericht aanspreken: <br>" +
    "&nbsp;&nbsp;&nbsp;- Wat afgesproken is beoordelen  <br>" +
    "&nbsp;&nbsp;&nbsp;- Expliciteren wat werkt <br>" +
    "&nbsp;&nbsp;&nbsp;- Beoordelen op de verantwoordelijkheid voor het resultaat <br>"
    ,
    "<b>Vertellen</b> <br>" +
    "Meevoelend verbinden (sympathie): <br>" +
    "&nbsp;&nbsp;&nbsp;- Persoonskenmerken benoemen <br>" +
    "&nbsp;&nbsp;&nbsp;- Relatie benoemen <br>" +
    "&nbsp;&nbsp;&nbsp;- Praten over dagelijkse dingen <br>" +
    "&nbsp;&nbsp;&nbsp;- Iets over jezelf vertellen <br>" +
    "&nbsp;&nbsp;&nbsp;- Blik van verstandhouding <br>" +
    "&nbsp;&nbsp;&nbsp;- Humor inzetten <br>" +
    "Actief luisterend aansluiten: <br>" +
    "&nbsp;&nbsp;&nbsp;- Open vragen stellen <br>" +
    "&nbsp;&nbsp;&nbsp;- Doorvragen <br>" +
    "&nbsp;&nbsp;&nbsp;- Aansluiten bij verhaal gesprekspartner <br>" +
    "&nbsp;&nbsp;&nbsp;- Oogcontact maken <br>" +
    "&nbsp;&nbsp;&nbsp;- Hummen <br>" +
    "&nbsp;&nbsp;&nbsp;- Stiltes laten vallen <br>" +
    "Waarderend (partijdig) aanspreken: <br>" +
    "&nbsp;&nbsp;&nbsp;- Compliment geven <br>" +
    "&nbsp;&nbsp;&nbsp;- Excuses aanbieden <br>" +
    "&nbsp;&nbsp;&nbsp;- De situatie beoordelen <br>"
    ,
    "<b>Overleggen</b> <br>" +
    "Zich verplaatsend in een ander verbinden (empathie): <br>" +
    "&nbsp;&nbsp;&nbsp;- Snappen dat het belangrijk voor iemand is <br>" +
    "&nbsp;&nbsp;&nbsp;- Zeggen dat je iets begrijpt <br>" +
    "&nbsp;&nbsp;&nbsp;- Rekening houden met de ander <br>" +
    "Tactisch aansluiten: <br>" +
    "&nbsp;&nbsp;&nbsp;- Samen probleem formuleren <br>" +
    "&nbsp;&nbsp;&nbsp;- Op een lijn komen <br>" +
    "&nbsp;&nbsp;&nbsp;- Op het juiste moment iets inbrengen <br>" +
    "&nbsp;&nbsp;&nbsp;- Samen analyseren <br>" +
    "&nbsp;&nbsp;&nbsp;- Klopt het dat <br>" +
    "&nbsp;&nbsp;&nbsp;- Op een rijtje zetten <br>" +
    "Meervoudig partijdig aanspreken: <br>" +
    "&nbsp;&nbsp;&nbsp;- Ander perspectief inbrengen <br>" +
    "&nbsp;&nbsp;&nbsp;- Andere informatie inbrengen <br>" +
    "&nbsp;&nbsp;&nbsp;- Stel-dat-vragen (circulair navragen) <br>"
    ,
    "<b>Afspreken</b> <br>" +
    "Taakgericht verbinden: <br>" +
    "&nbsp;&nbsp;&nbsp;- Afspraak maken <br>" +
    "&nbsp;&nbsp;&nbsp;- Ieders verantwoordelijkheid bespreken <br>" +
    "&nbsp;&nbsp;&nbsp;- Overeenstemmen wat moet gebeuren <br>" +
    "&nbsp;&nbsp;&nbsp;- Een voorstel vragen of er mee komen <br>" +
    "Doelgericht aansluiten: <br>" +
    "&nbsp;&nbsp;&nbsp;- Afspraken nakomen/bewaken <br>" +
    "&nbsp;&nbsp;&nbsp;- Gebruik maken van dossierkennis <br>" +
    "&nbsp;&nbsp;&nbsp;- Proces bewaken <br>" +
    "Resultaatgericht aanspreken: <br>" +
    "&nbsp;&nbsp;&nbsp;- Wat afgesproken is beoordelen  <br>" +
    "&nbsp;&nbsp;&nbsp;- Expliciteren wat werkt <br>" +
    "&nbsp;&nbsp;&nbsp;- Beoordelen op de verantwoordelijkheid voor het resultaat <br>"
];

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

jQuery(document).ready(function(){
   jQuery('#video').bind('contextmenu',function() { return false; });
});

function setMenuItem(){
    if(currentUser.toLowerCase() == video[0].email.toLowerCase()){
        document.getElementById("myVideosMenu").className = "menuItem selectedMenu";
        document.getElementsByClassName("initialMarker")[0].innerHTML = "Start de video om een markering te plaatsen.  Een markering is een moment" +
		" in de video waar u uw collega&rsquo;s naar wilt laten kijken. U plaatst een markering door de video te starten en op het gewenste raakmoment op de gele knop met de + te drukken. U kunt meerdere markeringen plaatsen. Bij iedere markering kunt u &eacute;&eacute;n of meer" +
		" kijkvragen toevoegen. Zo weten uw collega&rsquo;s waar u feedback op wilt ontvangen. <br><br> Bent u klaar? Denk eraan uw netwerk per e-mail" +
		" te informeren dat er een video met kijkvragen klaar staat om te bekijken.";
    }else{
        document.getElementById("sharedVideosMenu").className = "menuItem selectedMenu";
        document.getElementsByClassName("initialMarker")[0].innerHTML = "Start de video en klik op een markering om de details te bekijken.";
    }
}

//Init page and load video
jQuery( window ).load(function() {
    checkLoggedIn();
});

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
                getCurrentVideo();
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

//Use local storage id to get current video
function getCurrentVideo(){
    jQuery.ajax({
        method: "POST",
        data: {
            'getVideoById': true
        },
        url: databaseActivities,
        success: function (result) {
            video = JSON.parse(result);
            if(video.length != 0){
                showCurrentVideo(video);
                getVideoMarkers(video, "init");
                document.getElementById("videoNotFound").innerHTML = "";
                checkIsAllowed();
            }else{
                showVideoNotFound();
                document.getElementById("video").innerHTML = "";
            }
        }
    });
}

//Show Video.js object of current video on screen
function showCurrentVideo(video){
    var id = video[0].id;
    var videoUrl = baseLink + video[0].videoUrl;
    var title = video[0].title;
    var description = video[0].description;
    var fullVid =  "<video id='"+id+"' webkit-playsinline controls nativeControlsForTouch='false' preload='metadata' class='video-js vjs-default-skin vid' width='640' height='320'><source src='"+videoUrl+"' type='video/mp4'></video>";
    fullVid += "<div id='addMarkerInner' onclick='openAddMarkerForm("+id+")'><p>+</p></div>";
    var fullData = "<p id='description'>"+description+"</p><p id='videoCase'>"+video[0].casename+"</p>";

    document.getElementById("video").innerHTML = fullVid;
    document.getElementById("videoData").innerHTML = fullData;
    document.getElementById("videoTitle").innerHTML = "<h3>"+video[0].title+"</h3>";

    player = videojs(id);
}

//Get questions for the current video
function getVideoQuestions(markers){
    jQuery.ajax({
        method: "POST",
        data: {
          'getVideoQuestions': true,
        },
        url: databaseActivities,
        success: function (result) {
            var questions = JSON.parse(result);
            showVideoQuestions(questions, markers);
        }
    });
}

//Show the questions next to the video with marker data
function showVideoQuestions(questions){
    //document.getElementById("questionsHeader").innerHTML = "<div id='questionIcon'></div><div id='questionsTitle'><h3>Kijkvragen</h3></div>";
    var questionSection = "";
    for(var i = 0; i < questions.length; i++){
        var counterType = "emptyCounter";
        questionSection += "<div id='"+questions[i].id+"' class='question' onclick=\"highlightQuestion(id, "+i+")\"><div class='questionCount'><div class='"+counterType+"'></div></div>";
        questionSection += "<div class='questionText'><h4 class='questionTextOpen'>"+questions[i].question+"</h4><p class='questionInfo'></p></div>";
        questionSection += "<div class='newQuestionInfoContainer'><button class='questionOptionsIcon' onclick=\"openInfoNewMarker('"+questions[i].infoId+"','"+i+"');cancelBubble(event)\">meer info</button></div>";
        questionSection += "</div>";
        if(i < questions.length-1){
            questionSection += "<hr class='questionSeparator' />";
        }
    }
    document.getElementById("questions").innerHTML = questionSection;
}

//Highlight the question on click and show add marker button
function highlightQuestion(id, classId){
    for(var i = 0; i < document.getElementsByClassName("question").length; i++){
        var selectedQuestion = document.getElementsByClassName("question")[i];
        if(document.getElementsByClassName("question")[i].id == id){
            if(selectedQuestion.classList.contains("selectedQuestion")){
                var selectedIcon = selectedQuestion.childNodes[0].childNodes[0];
                selectedIcon.className = "emptyCounter";
                selectedQuestion.classList.remove("selectedQuestion");
                var index = selectedQuestions.indexOf(id);
                selectedQuestions.splice(index, 1);
                document.getElementsByClassName("questionOptionsIcon")[classId].style.display = "none";
                document.getElementsByClassName("questionInfo")[classId].innerHTML = "";
            }else{
                var selectedIcon = selectedQuestion.childNodes[0].childNodes[0];
                selectedIcon.className = "fullCounter";
                selectedQuestion.className += " selectedQuestion";
                selectedQuestions.push(id);
                if(classId != 0){
                    document.getElementsByClassName("questionOptionsIcon")[classId].style.display = "block";
                }
            }
        }
    }
}

//Get markers voor current video
function getVideoMarkers(video, type, id, description){
    var videoId = video[0].id;
    jQuery.ajax({
        method: "POST",
        data: {
            'getVideoMarkers': true,
            'videoId': videoId
        },
        url: databaseActivities,
        success: function (result) {
            var foundMarkers = JSON.parse(result);
            markers = foundMarkers;
            if(type == "init"){
                addMarkersToVideo(markers);
            }else if(type == "update"){
                updateMarkers(markers);
                for(var i = 0; i < markers.length; i++){
                    if(markers[i].videoId == id && markers[i].description == description){
                        openMarker(markers[i].id);
                    }
                }
            }
        }
    });
}

//Add markers and functions on the video timeline
function addMarkersToVideo(markers){
    var addedMarkers = [];
    for(var i = 0; i < markers.length; i++){
        var marker = {time: parseFloat(markers[i].time), description: markers[i].description, id: markers[i].id, class: "redMarker"};
        addedMarkers.push(marker);
    }

    document.getElementsByTagName("video")[0].addEventListener('play', function(event) {
        if(currentUser.toLowerCase() == video[0].email.toLowerCase()){
            document.getElementById("addMarkerInner").style.display = "flex";
        }

        try{
            if(markers.length > 0){
                player.markers({
                    markers: [],
                    markerTip:{
                        display: true,
                        text: function(marker) {
                            return marker.description;
                        },
                        time: function(marker) {
                            return marker.time;
                        }
                    },
                    onMarkerClick: function(marker) {
                        openMarker(marker.id);
                        onMarkerReached(marker.key);
                    },
                    onMarkerReached: function(marker) {}
                });
                player.markers.add(addedMarkers);
            }else{
                player.markers({
                    markers: []
                });
                showMarkersNotFound();
            }
        } catch (e) {
        }
    }, false);
}

//Open details of a single marker after a marker in the video is clicked
function openMarker(markerId, afterUpdate){
    player.pause();
    getMarker(markerId, afterUpdate);
}

//Update markers after a new one is inserted
function updateMarkers(markers){
    var addedMarkers = [];
    for(var i = 0; i < markers.length; i++){
        var marker = {time: parseFloat(markers[i].time), description: markers[i].description, id: markers[i].id, class: "redMarker"};
        addedMarkers.push(marker);
    }
    player.markers.destroy();
    player.markers({
        markers: [],
        markerTip:{
            display: true,
            text: function(marker) {
                return marker.description;
            },
            time: function(marker) {
                return marker.time;
            }
        },
        onMarkerClick: function(marker) {
            openMarker(marker.id);
            onMarkerReached(marker.key);
        },
        onMarkerReached: function(marker) {}
    });
    player.markers.add(addedMarkers);
}

//Open the form to add a new marker to the video
function openAddMarkerForm(videoId, markers){
    player.pause();
    onMarkerReached();
    var addMarkerForm = "";
    var addQuestion = "";
    addMarkerForm += "<div class='addMarkerHeader'><h3>Welke vragen wil je stellen?</h3></div><div id='markerData'>";
    addMarkerForm += "<textarea type='text' rows='5' id='addMarkerDescription' name='addMarkerDescription' placeholder='Geef hier een toelichting of uitleg bij deze markering'></textarea>";
    addMarkerForm += "</div><div id='questions'></div>";
    addMarkerForm += "<div id='addMarkerButtonDiv'><div id='noQuestionSelected'></div><button id='addMarkerButton' name='addMarkerButton' onclick='addMarker()'>Toevoegen</button></div>";
    getVideoQuestions(markers);
    document.getElementById("markerSection").innerHTML = addMarkerForm;
}

//Add new marker to the video
function addMarker(){
    if(selectedQuestions.length > 0){
        var description = document.getElementById("addMarkerDescription").value;
        var questionString = selectedQuestions.join("-");
        jQuery.ajax({
            method: "POST",
            data: {
              'addMarkerToVideo': true,
              'videoId': video[0].id,
              'questions': questionString,
              'description': description,
              'time': player.currentTime(),
              'date': new Date().getTime()
            },
            url: databaseActivities,
            success: function (result) {
                getVideoMarkers(video, "update", video[0].id, description);
                showToast("Marker toegevoegd");
                selectedQuestions = [];
            }
        });
    }else{
        document.getElementById("noQuestionSelected").innerHTML = "Selecteer minstens 1 vraag!";
    }
}

//Delete an existing marker from the video
function deleteMarker(id){
    if(confirm('Weet u zeker dat u deze marker permanent wilt verwijderen?')){
        jQuery.ajax({
            method: "POST",
            data: {
              'deleteMarkerFromVideo': true,
              'markerId': id,
            },
            url: databaseActivities,
            success: function (result) {
                getVideoMarkers(video, "update");
                document.getElementById("markerSection").innerHTML = "";
                showToast("Marker verwijderd");
            }
        });
    }
}

//Edit an existing marker
function openEditMarkerForm(id){
    var editMarkerForm = "<div class='editMarkerForm'>";
    editMarkerForm += "<textarea type='text' rows='5' id='editMarkerDescription' name='editMarkerDescription' value=''></textarea>";
    editMarkerForm += "<div id='editMarkerButton'><button name='editMarkerButton' onclick='editMarker("+id+")'>Aanpassen</button></div></div>";
    document.getElementsByClassName("markerDescription")[0].innerHTML = editMarkerForm;
    document.getElementsByClassName("markerDate")[0].style.display = "none";
    getMarker(id, "update");
}

//Get a single existing marker to edit
function getMarker(id, type){
    jQuery.ajax({
        method: "POST",
        data: {
          'getMarkerById': true,
          'markerId': id
        },
        url: databaseActivities,
        success: function (result) {
            var marker = JSON.parse(result);
            if(type == "update"){
                fillEditMarkerForm(marker);
            }else if(type == "afterUpdate"){
                var markerKey = getMarkerKey(marker);
                onMarkerReached(markerKey);
                getMarkerQuestions(marker);
            }else{
                getMarkerQuestions(marker);
                var markerKey = getMarkerKey(marker);
                onMarkerReached(markerKey);
            }
        }
    });
}

//Get the key of an existing marker
function getMarkerKey(marker){
    var markerKey = 0;
    var markerList = player.markers.getMarkers();
    for(var i = 0; i < markerList.length; i++){
        if(marker[0].id.toString() == markerList[i].id){
            markerKey = markerList[i].key;
        }
    }
    return markerKey;
}

//Get the question linked to a marker (can be question or custom question)
function getMarkerQuestions(marker){
    jQuery.ajax({
        method: "POST",
        data: {
          'getMarkerQuestions': true,
          'markerId': marker[0].id
        },
        url: databaseActivities,
        success: function (result) {
            var questions = JSON.parse(result);
            showMarkerDetails(marker, questions);
        }
    });
}

//Fill the edit marker form with the current marker data
function fillEditMarkerForm(marker){
    document.getElementById("editMarkerDescription").value = marker[0].description;
}

//Show the details of a marker after click
function showMarkerDetails(marker, questions){
    var markerData = "<div class='markerData'>";
    var date = new Date(null);
    date.setSeconds(marker[0].time);
    var time = date.toISOString().substr(11, 8);
	var desc = "";
	var descHeader = "";
	if(marker[0].description == "" || marker[0].description == null || marker[0].description == undefined){
		if(currentUser.toLowerCase() != video[0].email.toLowerCase()){
			desc = "Geen beschrijving bij deze markering.";
		}else{
			desc = "Klik op de pen om een beschrijving aan de markering toe te voegen.";
		}
	}else{
		desc = marker[0].description;
		descHeader = "<p class='descHeader'>Toelichting of uitleg bij de markering:</p>";
	}
    markerData += "<div class='markerHeader'>";
    markerData += "<div class='markerTitle'><h3>Markering op "+time+"</h3></div>";
	markerData += "<div id='"+marker[0].id+"' class='deleteMarker' onclick='deleteMarker(id)'></div>";
    markerData += "</div>";
    markerData += "<div class='markerBody'>";
    markerData += "<div class='markerOptions'><div id='"+marker[0].id+"' class='editMarker' onclick='openEditMarkerForm(id)'></div></div>";
    markerData += "<div class='markerDescription'>"+descHeader+"<p>"+desc+"</p></div>";
    markerData += "<div class='markerDate'><p>"+convertDate(marker[0].date)+"</p></div></div>";
    markerData += showMarkerQuestions(marker[0].id, questions);
    markerData += "</div>";

    document.getElementById("markerSection").innerHTML = markerData;
    if(currentUser.toLowerCase() != video[0].email.toLowerCase()){
        document.getElementsByClassName("markerOptions")[0].style.visibility = "hidden";
		document.getElementsByClassName("deleteMarker")[0].style.visibility = "hidden";
    }
}

//Show selected questions under marker details
function showMarkerQuestions(markerId, questions){
    console.log(questions);
    var questionData = "<div class='questionBody'>";
    for(var i = 0; i < questions.length; i++){
        questionData += "<div class='markerQuestion' onclick=\"getMarkerComments('"+questions[i].id+"', '"+i+"', '"+questions[i].infoId+"','','"+markerId+"')\"><div class='questionOptions'>";
        questionData += "";
        questionData += "</div><div class='markerQuestionInfo'><h4>"+questions[i].question+"</h4><button class='questionOptionsIcon' onclick=\"openInfo('"+questions[i].infoId+"','"+i+"');cancelBubble(event)\">meer info</button><p class='questionInfo'></p></div><div class='markerQuestionIconDiv'><div class='markerQuestionIcon'></div></div></div>";
        questionData += "<div class='markerQuestionComments'></div>";
    }
    questionData += "</div>";
    return questionData;
}

//Show extra info for a question
function openInfo(infoId, classId){
    var buttonInfo = document.getElementsByClassName("questionOptionsIcon")[classId];
    var questionInfo = document.getElementsByClassName("questionInfo")[classId];
    if(questionInfo.innerHTML == ""){
        questionInfo.innerHTML = infoDetails[infoId-1];
        buttonInfo.innerHTML = "sluiten";
    }else{
        questionInfo.innerHTML = "";
        buttonInfo.innerHTML = "meer info";
    }
}

//Show extra info for a question with a new marker
function openInfoNewMarker(infoId, classId){
    var buttonInfo = document.getElementsByClassName("questionOptionsIcon")[classId];
    var questionInfo = document.getElementsByClassName("questionInfo")[classId];
    if(questionInfo.innerHTML == ""){
        console.log(infoId);
        questionInfo.innerHTML = infoDetails[infoId-1];
        questionInfo.style.marginBottom = "20px";
        buttonInfo.innerHTML = "sluiten";
    }else{
        questionInfo.innerHTML = "";
        questionInfo.style.marginBottom = "0px";
        buttonInfo.innerHTML = "meer info";
    }
}

//Stop function bubble
function cancelBubble(e) {
    var evt = e ? e:window.event;
    if (evt.stopPropagation)    evt.stopPropagation();
    if (evt.cancelBubble!=null) evt.cancelBubble = true;
}

//Edit an existing marker
function editMarker(id){
    jQuery.ajax({
        method: "POST",
        data: {
          'editMarker': true,
          'markerId': id,
          'description': document.getElementById("editMarkerDescription").value
        },
        url: databaseActivities,
        success: function (result) {
            getVideoMarkers(video, "update");
            openMarker(id, "afterUpdate");
            showToast("Marker aangepast");
        }
    });
}

//Open comment on marker form
function openCommentOnMarkerForm(markerQuestionId, classId, markerCommentQuestionLink, markerId){
    var className = "markerMessageInput" + classId;
    var commentOnMarkerForm = "<textarea rows='5' id='commentOnMarkerMessage' class='"+className+"' name='commentOnMarkerMessage' placeholder='Wat wil je zeggen'></textarea>";
    commentOnMarkerForm += "<div id='commentOnMarkerError' class='errorResult'></div>";
    commentOnMarkerForm += "<button id='"+markerQuestionId+"' name='commentOnMarkerButton' onclick=\"commentOnMarker(id,'"+classId+"', '"+markerCommentQuestionLink+"','"+markerId+"')\">Reageren</button>";
    document.getElementsByClassName("markerQuestionComments")[classId].innerHTML += commentOnMarkerForm;
    document.getElementsByClassName(className)[0].addEventListener('keypress', function(){
        // if(event.keyCode == 13){
        //     commentOnMarker(markerQuestionId, classId);
        // }
    });
}

//Save the message of the comment on a marker
function commentOnMarker(markerQuestionId, classId, markerCommentQuestionLink, markerId){
    var textArea = document.getElementById('commentOnMarkerMessage').value;
    console.log(textArea);
    var validateTextArea = validateTextarea(textArea);
    if(validateTextArea == true){
        console.log("is valid");
        jQuery.ajax({
            method: "POST",
            data: {
              'commentOnMarker': true,
              'markerQuestionId': markerCommentQuestionLink,
              'message': document.getElementById("commentOnMarkerMessage").value,
              'date': new Date().getTime()
            },
            url: databaseActivities,
            success: function (result) {
                getMarkerComments(markerQuestionId, classId, 0, "update", markerId);
                showToast("Reactie toegevoegd");
            }
        });
    }

}


//Validate textarea
function validateTextarea(textArea){
    if(textArea == '' || textArea == null || textArea.lenght == 0){
        document.getElementById("commentOnMarkerMessage").style.borderBottom = "1px solid #FF7888";
        document.getElementById("commentOnMarkerError").innerHTML = "Vul een reactie in";
        return false;
    }else{
        return true;
    }
}

//Get comments of a single marker
function getMarkerComments(markerQuestionId, classId, infoId, type, markerId){
    if(document.getElementsByClassName("markerQuestionComments")[classId].innerHTML == "" || type == "update"){
        jQuery.ajax({
            method: "POST",
            data: {
              'getMarkerComments': true,
              'markerQuestionId': markerQuestionId,
              'markerId': markerId
            },
            url: databaseActivities,
            success: function (result) {
                var comments = JSON.parse(result);
                jQuery.ajax({
                    method: "POST",
                    data: {
                      'getMarkerCommentQuestionLink': true,
                      'markerQuestionId': markerQuestionId,
                      'markerId': markerId
                    },
                    url: databaseActivities,
                    success: function (result) {
                        var markerCommentQuestionLink = JSON.parse(result);
                        showMarkerComments(markerQuestionId, comments, classId, infoId, markerCommentQuestionLink[0].id, markerId);
                    }
                });
            }
        });
    }else{
        document.getElementsByClassName("markerQuestionComments")[classId].innerHTML = "";
        document.getElementsByClassName("markerQuestionComments")[classId].style.display = "none";
        document.getElementsByClassName("questionOptionsIcon")[classId].style.display = "none";
        document.getElementsByClassName("markerQuestionIcon")[classId].style.backgroundImage = "url(../img/chevron_expand.png)";
        var questionInfo = document.getElementsByClassName("questionInfo")[classId];
        questionInfo.innerHTML = "";
    }

}

//Show comments under a marker
function showMarkerComments(markerQuestionId, comments, classId, infoId, markerCommentQuestionLink, markerId){
    var markerQuestions = "";
    if(comments.length != 0){
        for(var i = 0; i < comments.length; i++){
            var fullName = comments[i].name;
            fullName += " " + comments[i].insertion;
            fullName += " " + comments[i].lastName;
            markerQuestions += "<div id='"+comments[i].id+"' class='comment'><div class='commentName'><h4>"+fullName+"</h4></div><div class='commentDate'><p>"+convertDate(comments[i].date)+"</p></div><div class='commentMessage'><p>"+comments[i].message+"</p></div></div>";
        }
    }else{
        markerQuestions += "<p>Nog geen reacties.</p>";
    }
    //markerQuestions += "<h3 id='"+markerQuestionId+"' class='addCommentText' onclick=\"openCommentOnMarkerForm(id,'"+classId+"')\">Reageer</h3>";
    document.getElementsByClassName("markerQuestionComments")[classId].innerHTML = markerQuestions;
    document.getElementsByClassName("markerQuestionComments")[classId].style.display = "block";
    if(infoId != 0){
        document.getElementsByClassName("questionOptionsIcon")[classId].style.display = "block";
    }
    document.getElementsByClassName("markerQuestionIcon")[classId].style.backgroundImage = "url(../img/chevron_collapse.png)";
    openCommentOnMarkerForm(markerQuestionId, classId, markerCommentQuestionLink, markerId);
}

//Show a pop-up message (toast) when an action is performed that doesn't load a full page
var timer;
function showToast(message){
    var snackbar = document.getElementById("snackbar");
    snackbar.innerHTML = message;
    snackbar.className = "show";
    timer = setTimeout(function(){ snackbar.className = ""; }, 1200);
}

//Convert Epoch date timestamp to date
function convertDate(timestamp){
    var date = new Date();
    date.setTime(timestamp);
    var day = "";
    if(date.getDate().toString().length == 1){
        day = "0" + date.getDate();
    }else{
        day = date.getDate();
    }
    var month = "";
    if((date.getMonth()+1).toString().length == 1){
        month = "0" + (date.getMonth()+1);
    }else{
        month = (date.getMonth()+1);
    }
    var fullDate = day + "-" + month + "-" + date.getFullYear();
    return fullDate;
}

//Get the currenct videoMarker div with current marker key
function onMarkerReached (markerKey, index) {
    var markersList = player.markers.getMarkers();

    //remove the vjs-marker-current class from every marker
    for (var i = 0; i < markersList.length; i++) {
        var markerElement = player.el().querySelector(".vjs-marker[data-marker-key='" + markersList[i].key +"']");

        markerElement.className = markerElement.className.replace(new RegExp('(?:^|\\s)'+ 'vjs-marker-current' + '(?:\\s|$)'), '');
    }

    //add the vjs-marker-current class to the current marker
    if(markerKey != undefined){
        var markerCurrentElement = player.el().querySelector(".vjs-marker[data-marker-key='" + markerKey +"']");
        markerCurrentElement.className += " vjs-marker-current";
    }
}

//Check if the viewing user is the original video author to set permissions
function checkIsAllowed(){
    jQuery.ajax({
        method: "POST",
        data: {
            'getCurrentUser': true
        },
        url: databaseActivities,
        success: function (result) {
            currentUser = result;
            setMenuItem();
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
