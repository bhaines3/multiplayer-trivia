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
var points = 0;
var corrects = 0;
var incorrects = 0;
var timeOuts = 0;
var timerMech;
var numOfPlayers;
var isApi = false;
var isIt = false;
var isQuestionAnswered = database.ref("isQuestionAnswered");
var isApiGrabbed = database.ref("isApiGrabbed");
var apiQuestionCount = database.ref("currQuestionNumber");
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
var hasOneGuessed;
var hasTwoGuessed;
var hasThreeGuessed;
var hasFourGuessed;
isApiGrabbed.set(false);
isQuestionAnswered.set(false);
apiQuestionCount.once("value",function(snapshot){
    if (playerNumber === 0)
    {
    snapshot.set(qCount);
    }
});
//Initialize everything. Checking firebase to see what already exists so that when players come on, they see how many players have already signed in.
// MICHELLE, will you please explain this part to me... O actually I think I understand.
// this function listens to see if the API is grabbed and if so it retrieves the questions
isApiGrabbed.on("value",function(snapshot){
    if (snapshot.val() === true)
    {
        retrieveQuestionsAnswersFromFirebase();
        setTimeout(checkStatus, 2500);
    }
});

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
    else if (playerOneExists === false)
        {
            $("#player-cards").find("#card-0").remove();
            playerOneCardExists = false;
        }
    if (playerTwoExists === true)
        {
            avatarCall(snapshot.child(1).val().name,1);
            playerTwoCardExists = true;
        }
    else if (playerTwoExists === false)
        {
            $("#player-cards").find("#card-1").remove();
            playerTwoCardExists = false;
        }
    if (playerThreeExists === true)
        {
            avatarCall(snapshot.child(2).val().name,2);
            playerThreeCardExists = true;
        }
    else if (playerThreeExists === false)
        {
            $("#player-cards").find("#card-2").remove();
            playerThreeCardExists = false;
        }
    if (playerFourExists === true)
        {
            avatarCall(snapshot.child(3).val().name,3);
            playerFourCardExists = true;
        }
    else if (playerFourExists === false)
        {
            $("#player-cards").find("#card-3").remove();
            playerFourCardExists = false;
        }
});
// functions
function initializeGuesses() {
    var hasOneGuessed = false;
    var hasTwoGuessed = false;
    var hasThreeGuessed = false;
    var hasFourGuessed = false;
};
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
            .attr("id", `player-${playerNumber}`)
            .addClass("score")
            .html("Score:  ")
            .appendTo(smallerDiv);
        smallerDiv
            .addClass("card-body")
            .appendTo(thisWillBeACard);
        thisWillBeACard
            .attr("id", username)
            .addClass("card rounded")
            .css({"max-width":"13rem"})
            .appendTo(thisWillBeADiv);
        thisWillBeADiv
            .attr("id", `card-${playerNumber}`)
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
            playerOneExists = true;
            playerNumber = 0;
        }
        else if (playerTwoExists === false)
        {
            playerTwoExists = true;
            playerNumber = 1;
        }
        else if (playerThreeExists === false)
        {
            playerThreeExists = true;
            playerNumber = 2;
        }
        else if (playerFourExists === false)
        {
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
            createPlayerOnBase(playerNumber);
            avatarCall(userName, playerNumber);
        }
        //line of code that makes the users own card sit in front of the others (I hope)
        $(`#${userName}`).css({"z-index":"1"});
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
    //function that capitalizes the first letter of the name typed into the game.
    function capitalize(name) {
        return name.charAt(0).toUpperCase() + name.slice(1);
    }
};
// this function prints scores to a card
function printScore(number) {
    var playerScore;
    playersRef.once("value", function(snapshot){
        playerPoints = snapshot.child(number).val().points;
        playerCorrects = snapshot.child(number).val().correct;
        playerIncorrects = snapshot.child(number).val().incorrect;
    })
    $(`#player-${number}`)
        .html("Points:  " + playerPoints + "<br>" +
              "Corrects:  " + playerCorrects + "<br>" +
              "Incorrects: " + playerIncorrects)
        
};
// this function prints scores to every card
function printScoreEveryPlayer() {
    for (var i = 0; i < 4; i++) {
        printScore(i);
    }
}
//This function creates the player object on firebase
function createPlayerOnBase(number) {
    playerNumber = number;
    playerRef = database.ref("/players/" + playerNumber);
    playerRef.set({
        // name     
        name: userName,
        points: 0,
        // correct answers (per round?)
        correct: 0,
        // incorrect answers
        incorrect: 0,
        timeCorrect: 0,
        wins: 0,
        losses: 0,
        guessed: false,
    });
};
//This function allows players to see the ready button. **MICHELLE, ADD THE MULTIPLAYER COMPONENT***
function whatNext () {
    // readyButton = $("<button>");
    $("#readyButton")
    .html("<p class='lead'><a class='btn btn-outline-dark btn-lg'  href='#' role='button'>Get Ready!</a></p>");
        // .attr("id", "readyButton")
        // .appendTo("#header");
};
function initGame () {
    if (isApi === false) {
        apiQuestionCount.set(qCount);
        grabApi();
    }
};
function checkStatus() {
    isApiGrabbed.once("value", function(snapshot){
        isApi = snapshot.val();
    });
    if (isApi && playerFourExists) {
        alert("game starting!");
        $("#questionText").empty();
        $("#answers").empty();
        $("#readyButton").empty();
        startGame();
        //Prepping the layout to start the game and display our questions
    }
};
function clickListeners() {
    //When a new name has been submitted
    $(document).on("click", "#submitButton", function() {
        newName();
        $("#inputName").modal("hide");
    });
    $(document).keypress(function(e) {
        if (e.which == 13) {
            newName();
            $("#modalButtons").find("input:text").val("");
            $("#inputName").modal("hide");   
        }
    });
    //When the game started ** WE WILL NEED TO SOMEHOW DETERMINE WHEN ALL 4 PLAYERS HAVE SUCCESSFULLY CLICKED THIS BUTTON. For now, it is single player
    $(document).on("click", "#readyButton", function() {
        initGame();
        setTimeout(checkStatus, 2500);
    });
    $(document).on("click", ".answer", function(event) {
        if (hasChosenAnswer === false)
        playerRef.child("guessed").set(true);
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
        isApiGrabbed.set(true);
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
function retrieveQuestionsAnswersFromFirebase() {
    questionsArray = [];
    questionsRef.once("value", function(snapshot){
        questionsArray = snapshot.val();
    });
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
    printScoreEveryPlayer();
    isQuestionAnswered.set(false);
    hasChosenAnswer=false;
    initializeGuesses();
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
//increases qCount to move to the next question
function moveOn()
{
    apiQuestionCount.once("value", function(snapshot){
        //if there are still questions left, setUpHTML and run tmer again.
        qCount = snapshot.val();
    });
    if (qCount < questionsArray.length-1)
    {
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
    if (playerNumber === 0)
    {
        qCount++;
        apiQuestionCount.set(qCount);
    };
};
// function to increase wrongs by 1 for the player locally and in the database
function updateWrongs() {
    playerRef.once("value", function(snapshot) {
        incorrects = snapshot.val().incorrect;
    });
    incorrects++;
    playerRef.child("incorrect").set(incorrects);
};
//if user has ran out of time
function timedOut() {
    //add to the score
    timeOuts++;
    //guessed must be set to true to continue...
    playerRef.child("guessed").set(true);
    //update the text, clear the answers
    updateWrongs();
    $("#question").text("Time is up!");
    canWeContinue();
};
function rightChoice() {
    hasChosenAnswer = true;
    isQuestionAnswered.once("value", function(snapshot){
        isIt = snapshot.val();
        if (isIt === false) {
            points++;
            playerRef.child("points").set(points);
            isQuestionAnswered.set(true);
        }
    });
    $("#question").text("You got it!");
    playerRef.once("value", function(snapshot) {
        corrects = snapshot.val().correct;
    });
    corrects++;
    playerRef.child("correct").set(corrects);
    canWeContinue();
};
function wrongChoice() {
    hasChosenAnswer = true;
    $("#question").text("You're wrong!");
    updateWrongs();
    canWeContinue();
};
function canWeContinue() {
    playersRef.once("value", function(snapshot){
        hasOneGuessed = snapshot.child(0).val().guessed;
        hasTwoGuessed = snapshot.child(1).val().guessed;
        hasThreeGuessed = snapshot.child(2).val().guessed;
        hasFourGuessed = snapshot.child(3).val().guessed;
    });
    if (hasOneGuessed && hasTwoGuessed && hasThreeGuessed && hasFourGuessed) {
        $("#answers").empty();
        //stop timer
        clearInterval(timerMech);
        //wait 4 seconds and continue to next question or final screen
        setTimeout(moveOn, 4000);
    };
};
function hideStuff() {
    $("#questionsBox").hide();
    $("#timer").hide();
};
$(document).on("click", ".helpButton", function() {
   $(".helpButton").hide();
   $(".helpButton1").show();
});
$(document).on("click", ".helpButton1", function() {
    $(".helpButton1").hide();
    $(".helpButton").show();
 });
$(document).ready(function() {
    clickListeners();
    hideStuff();
    $('#inputName').modal("show");
});