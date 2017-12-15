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
var measurementsRef = database.ref("measurements");
var userName = "";
var allUsers = [];
var numberOfQuestions = 10;
var categoryNum = 9;
var questionsArray = [];
var timer = 10;
var qCount = 0;
var corrects = 0;
var incorrects = 0;
var timeOuts = 0;
var timerMech;
var playerOneExists;
var playerTwoExists;
var playerThreeExists;
var playerFourExists;
// var to see if we have 4 players before allowing the game to start
var notReadyYet = true;
//This variable measures when a user has clicked an answer. Error prevention for if user is able to press the correct/wrong answer multiple times
var hasChosenAnswer = false;

// functions

function avatarCall(username) {
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
};
function avatarByUser(array) {
    for (var i = 0; i < array.length; i++) {
        avatarCall(`${array[i]}`);
    }
};
function capitalize(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
}
function newName() {
    var input = capitalize($("#userName").val().trim());
    userName = input;
    playersRef.once("value", function(snapshot) {

        playerOneExists = snapshot.child("1").exists();
        playerTwoExists = snapshot.child("2").exists();
        playerThreeExists = snapshot.child("3").exists();
        playerFourExists = snapshot.child("4").exists();
        if (playerOneExists === false)
        {
            createPlayerOnBase(1);
            playerOneExists = true;
            playerNumber = 1;
        }
        else if (playerTwoExists === false)
        {
            createPlayerOnBase(2);
            playerTwoExists = true;
            playerNumber = 2;
        }
        else if (playerThreeExists === false)
        {
            createPlayerOnBase(3);
            playerThreeExists = true;
            playerNumber = 3;
        }
        else if (playerFourExists === false)
        {
            createPlayerOnBase(4);
            playerFourExists = true;
            playerNumber = 4;
        }
        else if (playerOneExists && playerTwoExists && playerThreeExists && playerFourExists)
        {
            alert("Too many players! Wait until there is room!")
        }
        playersRef.once("value", function(snapshot) {
            avatarCall(snapshot.child(playerNumber).val().name);
        });
        playerRef = database.ref("/players/" + playerNumber);
        playerRef.onDisconnect().remove();
    });
    // set up player info in database
    // on start game pull all users from firebase into allUsers array
    //$("#inputButtons").hide();
    populateArray();
    $("#inputButtons").find("input:text").val("");
    whatNext();
};
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
        // plan to insert objects into timePairs representing 
        // {which-question, guess-time} 
        // for CORRECT guesses only to compare at the end of the round
        time: 0,
        wins: 0,
        losses: 0
    });
};
function whatNext () {
    // I'm not sure why this needs to refer to playerThree instead of playerFour existing -J
    if (playerThreeExists) {
        $("#readyButton")
            .html("<p class='lead'><a class='btn btn-outline-dark btn-lg'  href='#' role='button'>Get Ready!</a></p>");
    };
}
function populateArray() {
    // if (allUsers.length === 0) {
    //     playersRef.once("value", function(snapshot) { 
    //         allUsers.push(snapshot.child(1).val().name);
    //         console.log(allUsers)
    //     });
    // } else if (allUsers.length === 1) {
    //     playersRef.once("value", function(snapshot) { 
    //         allUsers.push(snapshot.child(2).val().name);
    //         console.log(allUsers)
    //     });
    // } else if (allUsers.length === 2) {
    //     playersRef.once("value", function(snapshot) { 
    //         allUsers.push(snapshot.child(3).val().name);
    //         console.log(allUsers)
    //     });
    // } else if (allUsers.length === 3) {
    //     playersRef.once("value", function(snapshot) { 
    //         allUsers.push(snapshot.child(4).val().name);
    //         console.log(allUsers)
    //         var makeCardsButton = $("<button>");
    //         makeCardsButton
    //             .html("Make the Cards!")
    //             .attr("id", "makeCards")
    //             .css({"float":"right"})
    //             .appendTo("#header");
    //     });
    // };
};
function clickListeners() {
    $(document).on("click", "#makeCards", function() {
        avatarByUser(allUsers);
    });
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
        if (notReadyYet) {
            return
        } else {
            //Prepping the layout to start the game and display our questions
            $("#readyButton").empty();
            $("#questionText").empty();
            $("#answers").empty();
            

            //see startGame(); function
            startGame();
            console.log("The game has started");
        }
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
function startGame()
{
    var queryURL = "https://opentdb.com/api.php?amount=" +numberOfQuestions+ "&category="+categoryNum+"&difficulty=easy&type=multiple";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).done(function (response) {
        console.log(response);
        //collects the items we want from the API and stores it into an existing array.
        questionsArray = response.results;

        //starts the timer, sets up HTML for the questions, then displays questions/answers. See each function for more information
        setUpHTML();
        $("#questionsBox").show();
        $("#timer").show();
        startTimer();
        placeQuestionsAnswersToFirebase();
        showQuestionsAnswers();
    });
}
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
}
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
}
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
}
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
}
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
}
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
}
//HERE AND BELOW, STILL WORKING ON CLICK EVENTS WHEN USER CHOOSES CORRECT/WRONG ANSWER
function rightChoice() {
    corrects++;
    hasChosenAnswer = true;
    $("#question").text("You got it!");
    $("#answers").empty();
    clearInterval(timerMech);
    setTimeout(moveOn, 4000);
}
function wrongChoice() {
    incorrects++;
    hasChosenAnswer = true;
    $("#question").text("You're wrong!");
    $("#answers").empty();
    clearInterval(timerMech);
    setTimeout(moveOn, 4000);
}
$(document).ready(function () {
    clickListeners();
    $("#questionsBox").hide();
    $("#timer").hide();
    //playersRef.on("value", function(snapshot) {
      //  console.log(snapshot.val());
    //})
});