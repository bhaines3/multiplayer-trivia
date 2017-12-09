var userInfo = {
    userNames: ["brandon", "jason", "michelle", "andrew"],
};
var avatarCall = function(username) {
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
$(document).ready(function() {
    avatarByUser(userInfo.userNames);
});
//added ajax template

var hasStarted = false;
var numberOfQuestions = 10;
var categoryNum = 9;
var questionsArray = [];
var queryURL = "https://opentdb.com/api.php?amount=" +numberOfQuestions+ "&category="+categoryNum+"&difficulty=easy&type=multiple";
$.ajax({
    url: queryURL,
    method: "GET"
}).done(function (response) {
  console.log(response);
  for (var i = 0; i < numberOfQuestions; i ++)
  {
    questionsArray.push(response.results[i].question);
  }
  console.log(questionsArray);
});
$("#readyButton").click(function() {
  startGame(true);
  $("#readyButton").empty();
})

function startGame(hasStarted) {
  if (hasStarted = true)
  {
    //start the game
    console.log("The game has started")
  }
}