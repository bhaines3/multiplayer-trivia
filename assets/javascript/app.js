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
var correctAnswer;
var timer = 10;
var qCount = 0;
var corrects = 0;
var timerMech;
var numOfPlayers;
var playerPoints;
var playerWins;
var playerTies;
var numOfRounds = 0;
var isApi = false;
var gameStarted = false;
var isApiGrabbed = database.ref("isApiGrabbed");
var myScore;
var wins;
var ties;
var playerOneScore;
var playerTwoScore;
var playerThreeScore;
var playerFourScore;
var playerOneCardExists = null;
var playerTwoCardExists = null;
var playerThreeCardExists = null;
var playerFourCardExists = null;
var playerOneExists = null;
var playerTwoExists = null;
var playerThreeExists = null;
var playerFourExists = null;
//This variable measures when a user has clicked an answer. Error prevention for if user is able to press the correct/wrong answer multiple times
var hasChosenAnswer = false;
var hasOneFinished;
var hasTwoFinished;
var hasThreeFinished;
var hasFourFinished;
var isOneReady;
var isTwoReady;
var isThreeReady;
var isFourReady;

var hasOneSet;
var hasTwoSet;
var hasThreeSet;
var hasFourSet;
isApiGrabbed.set(false);

//Initialize everything. Checking firebase to see what already exists so that when players come on, they see how many players have already signed in.
// MICHELLE, will you please explain this part to me... O actually I think I understand.
// this function listens to see if the API is grabbed and if so it retrieves the questions
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
function avatarCall(username, playerNumber) {
    function makeCard(username)
    {
        var thisWillBeADiv = $("<div/>");
        var thisWillBeACard = $("<div/>");
        var imgPlace = $("<div/>");
        var avatar = $("<img/>");
        var smallerDiv = $("<div/>");
        var somebodysName = $("<h4/>");
        var playerNum = $("<h4/>");
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
        playerNum
            .attr("id", `player-${playerNumber}`)
            .addClass("playerNumber")
            .html("Player " + (playerNumber+1))
            .appendTo(smallerDiv);
        score
            .attr("id", `player-${playerNumber}`)
            .addClass("score")
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
function newName(input) {
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
            $("#instructions").html('Too many players! Wait until there is room! <a href="https://bhaines3.github.io/multiplayer-trivia">Try again</a> later');
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
};
//function that capitalizes the first letter of the name typed into the game.
    function capitalize(name) {
        return name.charAt(0).toUpperCase() + name.slice(1);
    }
// this function prints scores to a card
function printScore(number) {
    var playerScore;
    playersRef.once("value", function(snapshot){
        playerPoints = snapshot.child(number).val().points;
        playerWins = snapshot.child(number).val().wins;
        playerTies = snapshot.child(number).val().ties;
    })
    $(`#player-${number}`)
        .html("Score:  " + playerPoints + "<br>" +
              "Wins: " + playerWins + "<br>" +
              "Ties: " + playerTies);
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
        wins: 0,
        ties: 0,
        hasFinished: false,
        isReady: false,
        hasSet: false,
    });
};
function cancelFinishes() {
    playerRef.child("hasFinished").set(false);
};


playersRef.on("value", function(snapshot) {
    //Checking for some galdang finishes
    hasOneFinished = snapshot.child(0).val().hasFinished;
    hasTwoFinished = snapshot.child(1).val().hasFinished;
    hasThreeFinished = snapshot.child(2).val().hasFinished;
    hasFourFinished = snapshot.child(3).val().hasFinished;
    isOneReady = snapshot.child(0).val().isReady;
    isTwoReady = snapshot.child(1).val().isReady;
    isThreeReady = snapshot.child(2).val().isReady;
    isFourReady = snapshot.child(3).val().isReady;
    if (hasOneFinished && hasTwoFinished && hasThreeFinished && hasFourFinished) {
        $("#question").html("Here are the results!");
        //final screen, highlight winner
        determineWins(snapshot);
        printScoreEveryPlayer();
        gameStarted = false;
        whatNext();
        $("#readyButton").html("<p class='lead'><a class='btn btn-outline-dark btn-lg'  href='#' role='button'>Ready for next round?</a></p>");
    }
    if (gameStarted) {
        return
    } else if (isOneReady && isTwoReady && isThreeReady && isFourReady)
    {
        database.ref("/players/0").child("isReady").set(false);
        database.ref("/players/1").child("isReady").set(false);
        database.ref("/players/2").child("isReady").set(false);
        database.ref("/players/3").child("isReady").set(false);

        numOfRounds++;
        cancelFinishes();
        playerRef.child("hasSet").set(false);
        retrieveQuestionsAnswersFromFirebase();
        setTimeout(checkStatus, 2500);
    }
});

//This function allows players to see the ready button. **MICHELLE, ADD THE MULTIPLAYER COMPONENT***
function whatNext () {
    $("#readyButton")
    .html("<p class='lead'><a class='btn btn-outline-dark btn-lg'  href='#' role='button'>Get Ready!</a></p>");
};
function initGame () {
    if (isApi === false && playerNumber === 0) {
        grabApi();
    }
};
function checkStatus() {
    $("#questionText").empty();
    $("#answers").empty();
    $("#readyButton").empty();
    startGame();
};
function checkName(input) {
    if (input === "")
        {
            return false;
        }
    for (var i = 0; i < input.length; i++)
    {
        if (input.charCodeAt(i) < 48 ||
            (input.charCodeAt(i) > 57 && input.charCodeAt(i) < 65) ||
            (input.charCodeAt(i) > 90 && input.charCodeAt(i) < 97)  ||
            input.charCodeAt(i) > 122)
        {
            return false;
        }
    }
    return true;
}
function clickListeners() {
    //When a new name has been submitted
    $(document).on("click", "#submitButton", function() {
        var input = capitalize($("#userName").val().trim());
        if (checkName(input))
        {
            newName(input);
            $("#inputName").modal("hide");
        }
        else
        {
            $("#modalTitle").html("Name UNACCEPTABLE. No blanks, symbols, or spaces!");
        }
    });
    $(document).keypress(function(e) {
        if (e.which == 13) 
        {
            var input = capitalize($("#userName").val().trim());
            if (checkName(input))
            {
                newName(input);
                $("#modalButtons").find("input:text").val("");
                $("#inputName").modal("hide");
            }
            else
            {
                $("#modalTitle").html("Name UNACCEPTABLE. No blanks, symbols, or spaces!");
            }
        }
    });
    //When the game started ** WE WILL NEED TO SOMEHOW DETERMINE WHEN ALL 4 PLAYERS HAVE SUCCESSFULLY CLICKED THIS BUTTON. For now, it is single player
    $(document).on("click", "#readyButton", function() {
        qCount = 0;
        cancelFinishes();
        initGame();
        playerRef.child("isReady").set(true);
        $("#readyButton").text("Waiting for other players");
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
    isApiGrabbed.set(true);
    var queryURL = `https://opentdb.com/api.php?amount=2&difficulty=easy&type=multiple`;
    $.ajax({
        type: "GET",
        url: queryURL
    }).done(function(response) {
        console.log(response);
        //collects the items we want from the API and stores it into an existing array.
        questionsArray = response.results;
        placeQuestionsAnswersToFirebase();
    });
}
function startGame()
{
    //starts the timer, sets up HTML for the questions, then displays questions/answers. See each function for more information
    gameStarted = true;
    setUpHTML();
    $("#timerTitle").html("Timer<br>Round: " + numOfRounds);
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
    timer = 10;
    clearInterval(timerMech);

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
            $("#questionText").html((qCount+1) + ".) " + snapshot.child(qCount).val().question);
        });
    //randomizes placement of answers ***I COULD NOT FIND A WAY TO MAKE IT NEATER. IF YOU CAN, HELP?
    var randomCorrect = Math.floor(Math.random() * 4)+1;
    questionsRef.once("value", function(snapshot) { 
        correctAnswer = snapshot.child(qCount).val().rightAnswer;
        $("#answer"+randomCorrect)
            .attr("id", "correctAnswer")
            .html(correctAnswer);
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
    if (qCount < questionsArray.length-1)
    {
        setUpHTML();
        timer = 10;
        startTimer();
        showQuestionsAnswers();
        qCount++;
    }
    else
    {
        clearInterval(timerMech);
        $("#question").html("Waiting for other players to finish...");
        playerRef.child("isReady").set(false);
        playerRef.child("hasFinished").set(true);
    }
    
};
function determineWins(playersSnapshot) {

    var snapshot = playersSnapshot.child(playerNumber);

    if (snapshot.val().hasSet)
    {
        return;
    }
    playerRef.child("hasSet").set(true);

    playerOneScore = playersSnapshot.child(0).val().points;
    playerTwoScore = playersSnapshot.child(1).val().points;
    playerThreeScore = playersSnapshot.child(2).val().points;
    playerFourScore = playersSnapshot.child(3).val().points;

    if (playerNumber === 0) {
        myScore = playerOneScore;
        playerOneScore = 0;
    } else if (playerNumber === 1) {
        myScore = playerTwoScore;
        playerTwoScore = 0;
    } else if (playerNumber === 2) {
        myScore = playerThreeScore;
        playerThreeScore = 0;
    } else if (playerNumber === 3) {
        myScore = playerFourScore;
        playerFourScore = 0;
    } else {
        console.log("then who are you??? " + userName + "?");
    };

    if ((myScore > playerOneScore) &&
        (myScore > playerTwoScore) &&
        (myScore > playerThreeScore) &&
        (myScore > playerFourScore))
    {
        wins = snapshot.val().wins;
        wins++;
        playerRef.child("wins").set(wins);
    } else if ((myScore === playerOneScore) ||
        (myScore === playerTwoScore) ||
        (myScore === playerThreeScore) || 
        (myScore === playerFourScore))
    {
        ties = snapshot.val().ties;
        ties++;
        playerRef.child("ties").set(ties);
    }
};
//if user has ran out of time
function timedOut() {
    //update the text, clear the answers
    clearInterval(timerMech);
    $("#question").html("Time is up! The correct answer was... " + correctAnswer);
    setTimeout(moveOn, 4000);
};
function rightChoice() {
    hasChosenAnswer = true;
    $("#question").html("You got it!  The correct answer was... " + correctAnswer);
    playerRef.once("value", function(snapshot) {
        corrects = snapshot.val().points;
    });
    corrects++;
    playerRef.child("points").set(corrects);
    setTimeout(moveOn, 4000);
};
function wrongChoice() {
    hasChosenAnswer = true;
    $("#question").html("You're wrong!  The correct answer was... " + correctAnswer);
    setTimeout(moveOn, 4000);
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