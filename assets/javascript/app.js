// Initialize Firebase
var config = {
apiKey: "AIzaSyDbe5PAGMfowTdK799Rr-UwMmc85bHKSjQ",
authDomain: "multiplayer-trivia-game.firebaseapp.com",
databaseURL: "https://multiplayer-trivia-game.firebaseio.com",
projectId: "multiplayer-trivia-game",
storageBucket: "multiplayer-trivia-game.appspot.com",
messagingSenderId: "350872634445"
};
firebase.initializeApp(config);

// vars
var database = firebase.database();
var playersRef = database.ref("players");
var playerRef;
var playerNumber;
var questionsRef = database.ref("questions");
var questionRef;
var userName = "";
var questionsArray = [];
var timer = 10;
var qCount = 0;
var corrects = 0;
var incorrects = 0;
var timeOuts = 0;
var timerMech;
var numOfPlayers;
var isApiGrabbed = false;
var playerOneCardExists = null;
var playerTwoCardExists = null;
var playerThreeCardExists = null;
var playerFourCardExists = null;
var playerOneExists = null;
var playerTwoExists = null;
var playerThreeExists = null;
var playerFourExists = null;
var playerOneNotReady;
var playerTwoNotReady;
var playerThreeNotReady;
var playerFourNotReady;
//This variable measures when a user has clicked an answer. Error prevention for if user is able to press the correct/wrong answer multiple times
var hasChosenAnswer = false;

//Initialize everything. Checking firebase to see what already exists so that when players come on, they see how many players have already signed in.
playersRef.on("value", function(snapshot){
    //Checking and storing to see what players already exist
    playerOneExists = snapshot.child("0").exists();
    playerTwoExists = snapshot.child("1").exists();
    playerThreeExists = snapshot.child("2").exists();
    playerFourExists = snapshot.child("3").exists();
    //If a player already exists, display the card for this player. If not, don't do it.
    if (playerOneExists === true)
        {
            avatarCall(snapshot.child(0).val().name,0);
            playerOneCardExists = true;
        }
    if (playerTwoExists === true)
        {
            avatarCall(snapshot.child(1).val().name,1);
            playerTwoCardExists = true;
        }
    if (playerThreeExists === true)
        {
            avatarCall(snapshot.child(2).val().name,2);
            playerThreeCardExists = true;
        }
    if (playerFourExists === true)
        {
            avatarCall(snapshot.child(3).val().name,3);
            playerFourCardExists = true;
        }
});


// functions

function avatarCall(username, playerNumber) {
    function makeCard(username)
    {
        var thisWillBeADiv = $("<div/>");
        var thisWillBeACard = $("<div/>");
        var imgPlace = $("<div/>");
        var avatar = $("<img/>");
        var smallerDiv = $("<div/>");
        var somebodysName = $("<h4/>");
        var score = $("<p/>");
        imgPlace
            .addClass("row justify-content-center")
            .appendTo(thisWillBeACard);
        avatar
            .addClass("card-img-top avatar-image")
            .attr("src", `https://api.adorable.io/avatars/131/${username}.png`)
            .attr("alt", username)
            .appendTo(imgPlace);
        somebodysName
            .html(username)
            .appendTo(smallerDiv);
        score
            .addClass("score")
            .html("Score:  ")
            .appendTo(smallerDiv);
        smallerDiv
            .addClass("card-body")
            .appendTo(thisWillBeACard);
        thisWillBeACard
            .addClass("card rounded")
            .css({"width":"13rem"})
            .appendTo(thisWillBeADiv);
        thisWillBeADiv
            .attr("class", "col-3")
            .appendTo($("#player-cards"));
    }
    if(playerNumber === 0)
    {
        if (playerOneCardExists === true)
        {
            return
        }
        else
        {
            makeCard(username);
        }
    }
    if(playerNumber === 1)
    {
        if (playerTwoCardExists === true)
        {
            return
        }
        else
        {
            makeCard(username);
        }
    }
    if(playerNumber === 2)
    {
        if (playerThreeCardExists === true)
        {
            return
        }
        else
        {
            makeCard(username);
        }
    }
    if(playerNumber === 3)
    {
        if (playerFourCardExists === true)
        {
            return
        }
        else
        {
            makeCard(username);
        }
     }
 };

//function that capitalizes the first letter of the name typed into the game.
function capitalize(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
}
//function to place the new player on base. This function checks to see if players currently exist, and if not place this new player in that spot.
function newName() {
    var input = capitalize($("#userName").val().trim());
    userName = input;
    playersRef.once("value", function(snapshot) {        
        playerOneExists = snapshot.child("0").exists();
        playerTwoExists = snapshot.child("1").exists();
        playerThreeExists = snapshot.child("2").exists();
        playerFourExists = snapshot.child("3").exists();
        if (playerOneExists === false)
        {
            createPlayerOnBase(0);
            playerOneExists = true;
            playerNumber = 0;
        }
        else if (playerTwoExists === false)
        {
            createPlayerOnBase(1);
            playerTwoExists = true;
            playerNumber = 1;
        }
        else if (playerThreeExists === false)
        {
            createPlayerOnBase(2);
            playerThreeExists = true;
            playerNumber = 2;
        }
        else if (playerFourExists === false)
        {
            createPlayerOnBase(3);
            playerFourExists = true;
            playerNumber = 3;
        }
        else if (playerOneExists && playerTwoExists && playerThreeExists && playerFourExists)
        {
            alert("Too many players! Wait until there is room! Try again later")
        }

        //Counts the number of players
        numOfPlayers = snapshot.numChildren();

        //if there are still room for more players, continue adding the players. If not, don't add anymore.
        if (numOfPlayers < 4)
        {
            playersRef.once("value", function(snapshot) {
                avatarCall(snapshot.child(playerNumber).val().name, playerNumber);
            });
           playerRef = database.ref("/players/" + playerNumber);
        }
        //If a player disconnects, remove them from firebse.  ***STILL NEED TO SOMEHOW REMOVE CARD.
         playerRef.onDisconnect().remove(); 
    });
    // $("#inputButtons").hide();
    //**UI NEED-Please let the player who had just submitted their name that they are still waiting for other players.
    $("#inputButtons").find("input:text").val("");
    //If there are at least 2 players, show the "Get Ready" sign ***I NEED TO MAKE SURE THAT FIREBASE STORES WHEN EACH USER HAS CLICKED "GET READY" -M
    //Not sure why, but numOfPlayers is off by like 2. lol. -M
    if (numOfPlayers >= 0)
    {
    whatNext();
    }
};
//This function creates the player object on firebase
function createPlayerOnBase(number) {
    playerNumber = number;
    playerRef = database.ref("/players/" + playerNumber);
    playerRef.set({
        // name     
        name: userName,
        // correct answers (per round?)
        correct: 0,
        // incorrect answers
        incorrect: 0,
        timeCorrect: 0,
        wins: 0,
        losses: 0,
    });
};
//This function allows players to see the ready button. **MICHELLE, ADD THE MULTIPLAYER COMPONENT***
function whatNext () {
    $("#readyButton")
        .html("<p class='lead'><a class='btn btn-outline-dark btn-lg'  href='#' role='button'>Get Ready!</a></p>");
};
function initGame () {
    if (playerNumber === 0) {
        grabApi();
    }
};
function checkStatus() {
    if (isApiGrabbed && playerFourExists) {
        alert("game starting!");
        startGame();
        //Prepping the layout to start the game and display our questions
    }
};
function clickListeners() {
    //Whena  new name has been submitted
    $(document).on("click", "#submitButton", function() {
        newName();
    });
    $(document).keypress(function(e) {
        if (e.which == 13) {
            newName();
        }
    });
    //When the game started ** WE WILL NEED TO SOMEHOW DETERMINE WHEN ALL 4 PLAYERS HAVE SUCCESSFULLY CLICKED THIS BUTTON. For now, it is single player
    $(document).on("click", "#readyButton", function() {
        console.log(playerOneNotReady);
        console.log(numOfPlayers);
        $("#questionText").empty();
        $("#answers").empty();
        $("#readyButton").empty();
        initGame();
        console.log("The game has started");
    });
    $(document).on("click", ".answer", function(event) {
        if (hasChosenAnswer === false)
        {
            if ($(this).attr("id") === "correctAnswer")
            {
                //player has chosen correct answer
                clearInterval(timerMech);
                rightChoice();
            }
            else
            {
                //player has chosen the wrong answer
                clearInterval(timerMech);
                wrongChoice();
            }
        }
    });
};
//Michelle's code SORRY JASON IGNORE ME
//Sets up how the page first looks before start of game **STILL NEED TO MAKE PRETTY.
$("#countDown").text("Time left: "+timer);
function grabApi() {
    var queryURL = `https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple`;
    $.ajax({
        type: "GET",
        url: queryURL
    }).done(function(response) {
        console.log(response);
        //collects the items we want from the API and stores it into an existing array.
        questionsArray = response.results;
        placeQuestionsAnswersToFirebase();
        isApiGrabbed = true;
        checkStatus();
    });
}
function startGame()
{
    //starts the timer, sets up HTML for the questions, then displays questions/answers. See each function for more information
    setUpHTML();
    $("#questionsBox").show();
    $("#timer").show();
    showQuestionsAnswers();
    startTimer();
};
function placeQuestionsAnswersToFirebase() {
    questionsRef.set({
        })
    for (var i = 0; i < questionsArray.length; i++)
    {
        questionRef = database.ref("/questions/" + i)
        questionRef.set({
            question: questionsArray[i].question,
            rightAnswer: questionsArray[i].correct_answer,
            wrongAnswers: questionsArray[i].incorrect_answers
        })
    }
};
function startTimer()
{
    //timer begins using eggTimer function.
    timerMech = setInterval(eggTimer, 1000);
    function eggTimer(){
        //updates the timer HTML
        $("#countDown").text("Time left: "+timer);
        if (timer === 0)
        {

            //if a user has not made an answer in time. See timedOut function for more information
            timedOut();
            
        }
        else if (timer > 0)
        {
            //continue decreasing time if there are any.
            timer--;
        }
    }
};
//This function sets up the HTML to prepare for the placement of questions/answers
function setUpHTML() {
    // $("#questionsBox").html("<div  class='card' id='question'><div id='questionText'></div><div id='answers'></div><div class='card-body row'></div></div>");
    // $("#timer").html("<div class='card'><div class='card-body'><h4 class='card-title'>Timer</h4><div class='time' id='countDown' ></div></div></div>");
    $("#question").empty();
    questionDiv = $("<div>");
    questionDiv.attr("id", "questionText");
    $("#question").prepend(questionDiv);
    answersDiv = $("<div>");
    answersDiv.attr("id", "answers");
    $("#question").append(answersDiv);
    for (var i = 1; i < 5; i++)
    {
        var answerButton = $("<button>");
        answerButton
            .attr("id", "answer"+i)
            .attr("class", "answer")
            .appendTo($("#answers"));
    }
};
//function that displays the questions and answers
function showQuestionsAnswers()
{
    hasChosenAnswer=false;
    //displays questions in questionsText
    questionsRef.once("value", function(snapshot) { 
            $("#questionText").html(snapshot.child(qCount).val().question);
        });

    //randomizes placement of answers ***I COULD NOT FIND A WAY TO MAKE IT NEATER. IF YOU CAN, HELP?
    var randomCorrect = Math.floor(Math.random() * 4)+1;
    questionsRef.once("value", function(snapshot) { 
        $("#answer"+randomCorrect)
            .attr("id", "correctAnswer")
            .html(snapshot.child(qCount).val().rightAnswer);
        if (randomCorrect === 1)
        {
            for (var i = 0; i < 3; i++)
            {
                $("#answer"+(i+2)).html(snapshot.child(qCount).val().wrongAnswers[i]);
            }
        }
        else if (randomCorrect === 2)
        {
            $("#answer1").html(snapshot.child(qCount).val().wrongAnswers[0]);
            $("#answer3").html(snapshot.child(qCount).val().wrongAnswers[1]);
            $("#answer4").html(snapshot.child(qCount).val().wrongAnswers[2]);
        }
        else if (randomCorrect === 3)
        {
            $("#answer1").html(snapshot.child(qCount).val().wrongAnswers[0]);
            $("#answer2").html(snapshot.child(qCount).val().wrongAnswers[1]);
            $("#answer4").html(snapshot.child(qCount).val().wrongAnswers[2]);
        }
        else if (randomCorrect === 4)
        {
            for (var i = 0; i < 3; i++)
            {
                $("#answer"+(i+1)).html(snapshot.child(qCount).val().wrongAnswers[i]);
            }
        }
    });
};
//if user has ran out of time
function timedOut() {
    //add to the score
    timeOuts++;
    //update the text, clear the answers
    $("#question").text("Time is up!");
    $("#answers").empty();
    //stop timer
    clearInterval(timerMech);
    //wait 4 seconds and continue to next question or final screen
    setTimeout(moveOn, 4000);
};
//increases qCount to move to the next question
function moveOn()
{
    //if there are still questions left, setUpHTML and run tmer again.
    if (qCount < questionsArray.length-1)
    {
        qCount++;
        setUpHTML();
        timer = 10;
        startTimer();
        showQuestionsAnswers();
    }
    else
    {
        alert("the game ends here")
        //final screen
    }
};
//HERE AND BELOW, STILL WORKING ON CLICK EVENTS WHEN USER CHOOSES CORRECT/WRONG ANSWER
function rightChoice() {
    corrects++;
    hasChosenAnswer = true;
    $("#question").text("You got it!");
    $("#answers").empty();
    clearInterval(timerMech);
    setTimeout(moveOn, 4000);
};
function wrongChoice() {
    incorrects++;
    hasChosenAnswer = true;
    $("#question").text("You're wrong!");
    $("#answers").empty();
    clearInterval(timerMech);
    setTimeout(moveOn, 4000);
};
function hideStuff() {
    $("#questionsBox").hide();
    $("#timer").hide();
};
$(document).ready(function () {
    clickListeners();
    hideStuff()
});