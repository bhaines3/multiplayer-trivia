var userInfo = {
    userNames: ["brandon", "jason", "michelle", "andrew"],
};
var avatarCall = function(username) {
    var avatar = $("<img/>");
    var thisWillBeACard = $("<div/>");
    var somebodysName = $("<div/>")
    avatar
        .attr("src", `https://api.adorable.io/avatars/131/${username}.png`)
        .attr("alt", username)
        .appendTo(thisWillBeACard);
    somebodysName = $("<p/>")
    somebodysName
        .html(username)
        .appendTo(thisWillBeACard);
    thisWillBeACard
        .appendTo("body");
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
    console.log("The game has started");
  }
}