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

var database = firebase.database();
  
var userInfo = {
    userNames: [],
};
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
function clickListeners() {
    $(document).on("click", "#submitButton", function() {
        $("#player-cards").empty();
        console.log($("#userName").val().trim());
        var input = $("#userName").val().trim();
        console.log(input);
        userInfo.userNames.push(input);
        console.log(userInfo.userNames);
        avatarByUser(userInfo.userNames);
        $("#inputButtons").find("input:text").val("");
    });
    //When the game started ** WE WILL NEED TO SOMEHOW DETERMINE WHEN ALL 4 PLAYERS HAVE SUCCESSFULLY CLICKED THIS BUTTON. For now, it is single player
    $(document).on("click", "#readyButton", function() {
        //Prepping the layout to start the game and display our questions
        $("#readyButton").empty();
        $("#questionText").empty();
        $("#answers").empty();

        //see startGame(); function
        startGame();
        console.log("The game has started");
    });
    $(document).on("click", ".answer", function(event) {
        if ($(this).attr("id") === "correctAnswer")
        {
            alert("woohoo!");
            //player has chosen correct answer
            clearInterval(timerMech);
            rightChoice();
        }
        else
        {
            alert("boohoo");
            //player has chosen the wrong answer
            clearInterval(timerMech);
            wrongChoice();
        }
    })
};
//Michelle's code SORRY JASON IGNORE ME
var numberOfQuestions = 10;
var categoryNum = 9;
var questionsArray = [];
var timer = 10;
var qCount = 0;
var corrects = 0;
var incorrects = 0;
var timeOuts = 0;
var timerMech;
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
        startTimer();
        setUpHTML();
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
            $("#answer"+(i+2)).html(questionsArray[qCount].incorrect_answers[i]);
        }
    }
    else if (randomCorrect === 2)
    {
        $("#answer1").html(questionsArray[qCount].incorrect_answers[0]);
        $("#answer3").html(questionsArray[qCount].incorrect_answers[1]);
        $("#answer4").html(questionsArray[qCount].incorrect_answers[2]);
    }
    else if (randomCorrect === 3)
    {
        $("#answer1").html(questionsArray[qCount].incorrect_answers[0]);
        $("#answer2").html(questionsArray[qCount].incorrect_answers[1]);
        $("#answer4").html(questionsArray[qCount].incorrect_answers[2]);
    }
    else if (randomCorrect === 4)
    {
        for (var i = 0; i < 3; i++)
        {
            $("#answer"+(i+1)).html(questionsArray[qCount].incorrect_answers[i]);
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