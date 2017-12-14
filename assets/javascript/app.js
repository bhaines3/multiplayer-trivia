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
        .html("score goes here")
        .appendTo(smallerDiv);
    smallerDiv
        .addClass("card-body")
        .appendTo(thisWillBeACard);
    thisWillBeACard
        .addClass("card")
        .css({"width":"20rem"})
        .appendTo(thisWillBeADiv);
    thisWillBeADiv
        .attr("class", "col-3")
        .appendTo($("#player-cards"));
};
var avatarByUser = function (array) {
    for (var i = 0; i < array.length; i++) {
        avatarCall(`${array[i]}`);
    }
};
function isGameReady() {
    if (allUsers.length = 4) {
        notReadyYet = false;
    } else {
        return
    }
};
function newName() {
    $("#player-cards").empty();
    var input = $("#userName").val().trim();
    userName = input;
    // send the name to firebase
    database.ref("/userNames").push(userName);
    // retreive all users and push to the allUsers array
    database.ref("/userNames").on("child_added", function(snapshot) { 
        allUsers.push(snapshot.val());
    });
    if (allUsers.length = 1) {
        $("#readyButton")
            .html("<p class='lead'><a class='btn btn-outline-dark btn-lg'  href='#' role='button'>Get Ready!</a></p>");
    };
    // 1st person has start game button available with 2 or more ready player
    // on start game pull all users from firebase into allUsers array
    // $("#inputButtons").hide();
    avatarByUser(allUsers);
    $("#inputButtons").find("input:text").val("");
    isGameReady();
};
function emptyRoom() {
    //a line of code that does not work:
    database.ref("/userNames").empty();
};
function clickListeners() {
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
                hasChosenAnswer = true;
            }
            else
            {
                //player has chosen the wrong answer
                clearInterval(timerMech);
                wrongChoice();
                hasChosenAnswer = true;
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
        startTimer();
        showQuestionsAnswers();
    });
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
    $("#timer").html("<div class='card'><div class='card-body'><h4 class='card-title'>Timer</h4><div class='time' id='countDown' ></div></div></div>");
    $("#questionBox").empty();
    questionDiv = $("<div>");
    questionDiv.attr("id", "questionText");
    $("#questionBox").prepend(questionDiv);
    answersDiv = $("<div>");
    answersDiv.attr("id", "answers");
    $("#questionBox").append(answersDiv);
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
    //displays questions in questionsText
    $("#questionText").html(questionsArray[qCount].question);

    //randomizes placement of answers ***I COULD NOT FIND A WAY TO MAKE IT NEATER. IF YOU CAN, HELP?
    var randomCorrect = Math.floor(Math.random() * 4)+1;
    $("#answer"+randomCorrect)
        .attr("id", "correctAnswer")
        .text(questionsArray[qCount].correct_answer);
    if (randomCorrect === 1)
    {
        for (var i = 0; i < 3; i++)
        {
            $("#answer"+(i+2)).text(questionsArray[qCount].incorrect_answers[i]);
        }
    }
    else if (randomCorrect === 2)
    {
        $("#answer1").text(questionsArray[qCount].incorrect_answers[0]);
        $("#answer3").text(questionsArray[qCount].incorrect_answers[1]);
        $("#answer4").text(questionsArray[qCount].incorrect_answers[2]);
    }
    else if (randomCorrect === 3)
    {
        $("#answer1").text(questionsArray[qCount].incorrect_answers[0]);
        $("#answer2").text(questionsArray[qCount].incorrect_answers[1]);
        $("#answer4").text(questionsArray[qCount].incorrect_answers[2]);
    }
    else if (randomCorrect === 4)
    {
        for (var i = 0; i < 3; i++)
        {
            $("#answer"+(i+1)).text(questionsArray[qCount].incorrect_answers[i]);
        }
    }
}
//if user has ran out of time
function timedOut() {
    //add to the score
    timeOuts++;
    //update the text, clear the answers
    $("#questionBox").text("Time is up!");
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
    $("#questionBox").text("You got it!");
    $("#answers").empty();
    clearInterval(timerMech);
    setTimeout(moveOn, 4000);
}
function wrongChoice() {
    incorrects++;
    $("#questionBox").text("You're wrong!");
    $("#answers").empty();
    clearInterval(timerMech);
    setTimeout(moveOn, 4000);
}
$(document).ready(function () {
    clickListeners();
});