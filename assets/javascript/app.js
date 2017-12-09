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
$.ajax({
    url: "https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple",
    method: "GET"
}).done(function (response) {
  console.log(response.results, " this is the ajax response")
  //an array of 3 incorrect answers
  //one key value pair of the correct answer
  //take the 3 incorrect and correct and stor them into an possibles property on an obj wich will be an array
  for(var i = 0; i < response.results.length; i++) {
    //loop over each response object
    //generate an object to stor our array\
    var formatArray = []
    var obj = {};
    
    //push that formated object into our array after we format it
    formatArray.push(response.results[i].correct_answer)
    for (var j = 0; j < response.results[i].incorrect_answers.length; j++){
      formatArray.push(response.results[i].incorrect_answers[j])
    }
    formatArray = shuffle(formatArray);
    console.log(formatArray.indexOf(response.results[i].correct_answer), "this is our index of");
    if (formatArray.indexOf(response.results[i].correct_answer) !== -1) {
      obj.answer = formatArray.indexOf(response.results[i].correct_answer)
    }
    obj.question = response.results[i].question;
    obj.id = "question-" + i
    obj.possibles = formatArray;
    game.questions.push(obj)
  }
// Got this code from Stack Overflow to randomize array answers 
  function shuffle(array) {
    var currentIndex = array.length;
    var temporaryValue; 
    var randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }
})