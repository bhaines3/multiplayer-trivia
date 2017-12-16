// these vars need to go in the right place
var chatData = database.ref("/chat");
var username = "guest";
function makeChatArea() {
    var chatArea = $("<div>");
    var chatMessages = $("<pre>");
    var chatRow = $("<div>");
    var chatInput = $("<input>");
    var chatSend = $("<button>");
    chatArea
        .css({"position":"absolute","top":"200px","right":"20px","width":"225px","height":"30vh","background-color":"#f5f5f599"})
        .appendTo($("#header"));
    chatMessages
        .css({"overflow":"auto"})
        .attr("id", "chat-messages")
        .appendTo(chatArea);
    chatInput
        .attr("id", "chat-input")
        .appendTo(chatRow)
    chatSend
        .attr("id", "chat-send")
        .text("send")
        .appendTo(chatRow);
    chatRow
        .css({"position":"absolute","bottom":"0px"})
        .attr("class", "row")
        .appendTo(chatArea);
};
// Chat send button listener, grabs input and pushes to firebase. (Firebase's push automatically creates a unique key)
$("#chat-send").click(function() {

    if ($("#chat-input").val() !== "") {
  
      var message = $("#chat-input").val();
  
      chatData.push({
        name: username,
        message: message,
        time: firebase.database.ServerValue.TIMESTAMP,
        idNum: playerNumber
      });
  
      $("#chat-input").val("");
    }
  });
  // Chatbox input listener
$("#chat-input").keypress(function(e) {

    if (e.keyCode === 13 && $("#chat-input").val() !== "") {
  
      var message = $("#chat-input").val();
  
      chatData.push({
        name: username,
        message: message,
        time: firebase.database.ServerValue.TIMESTAMP,
        idNum: playerNumber
      });
  
      $("#chat-input").val("");
    }
  });

// Update chat on screen when new message detected - ordered by 'time' value
chatData.orderByChild("time").on("child_added", function(snapshot) {

    // If idNum is 0, then its a disconnect message and displays accordingly
    // If not - its a user chat message
    if (snapshot.val().idNum === 0) {
      $("#chat-messages").append("<p class=player" + snapshot.val().idNum + "><span>"
      + snapshot.val().name + "</span>: " + snapshot.val().message + "</p>");
    }
    else {
      $("#chat-messages").append("<p class=player" + snapshot.val().idNum + "><span>"
      + snapshot.val().name + "</span>: " + snapshot.val().message + "</p>");
    }
  
    // Keeps div scrolled to bottom on each update.
    $("#chat-messages").scrollTop($("#chat-messages")[0].scrollHeight);
});
// var chatDataDisc = database.ref("/chat/" + Date.now());
// chatDataDisc.onDisconnect().set({
//     name: username,
//     time: firebase.database.ServerValue.TIMESTAMP,
//     message: "has disconnected.",
//     idNum: 0
// });
$(document).ready(function(){
    makeChatArea();
});