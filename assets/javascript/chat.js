var chatData;
function makeChatButton() {
    var chatArea = $("<div>");
    var chatMessages = $("<pre>");
    var chatRow = $("<div>");
    var chatInput = $("<input>");
    var chatSend = $("<button>");
    var chatButton = $("<button>");
    var otherChatButton = $("<button>");
    chatButton
        .html("💬")
        .attr("id","bubbleButton1")
        .attr("class", "btn btn-outline-dark")
        .css({"position":"absolute","bottom":"10px","right":"20px","z-index":"2"})
        .appendTo("#header")
    otherChatButton
        .html("💬")
        .attr("id","bubbleButton2")
        .attr("class", "btn btn-outline-dark")
        .css({"position":"absolute","bottom":"10px","right":"320px","z-index":"2"})
        .appendTo("#header")
        .hide();
    chatArea
        .css({"position":"absolute","bottom":"10px","right":"20px","width":"300px","height":"250px","background-color":"#f5f5f599","z-index":"2",})
        .attr("id", "chat-area")
        .appendTo($("#header"))
        .hide();
    chatMessages
        .css({"position":"absolute","bottom":"30px","overflow":"auto","width":"300px","height":"200px"})
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
function chatClickListeners() {
// Chat send button listener, grabs input and pushes to firebase. (Firebase's push automatically creates a unique key)
  $("#bubbleButton1").click(function() {
    $("#chat-area").show();
    $("#bubbleButton2").show();
    $("#bubbleButton1").hide();
  });
  $("#bubbleButton2").click(function() {
    $("#chat-area").hide();
    $("#bubbleButton2").hide();
    $("#bubbleButton1").show();
  });
  $("#chat-send").click(function() {
    if ($("#chat-input").val() !== "") {
      var message = $("#chat-input").val();
      chatData.push({
        name: userName,
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
        name: userName,
        message: message,
        time: firebase.database.ServerValue.TIMESTAMP,
        idNum: (playerNumber)
      });
      $("#chat-input").val("");
    }
  });
};
function chatFirebaseListeners() {
  // Update chat on screen when new message detected - ordered by 'time' value
  chatData.orderByChild("time").on("child_added", function(snapshot) {
    $("#chat-messages").append("<p class=player" + snapshot.val().idNum + "><span>"
    + snapshot.val().name + "</span>: " + snapshot.val().message + "</p>");
    $("#chat-messages").scrollTop($("#chat-messages")[0].scrollHeight);
  });
};
function canWeChat(snapshot) {
  //Checking and storing to see what players already exist
  playerOneExists = snapshot.child("0").exists();
  playerTwoExists = snapshot.child("1").exists();
  playerThreeExists = snapshot.child("2").exists();
  playerFourExists = snapshot.child("3").exists();
  if (playerOneExists && playerTwoExists && playerThreeExists && playerFourExists) {
    chatPossible();
  } else {
    chatData.remove();
    $("#bubbleButton1").remove();
    $("#bubbleButton2").remove();
    $("#chat-area").remove();
  }
};
function chatPossible() {
  // For adding disconnects to the chat with a unique id (the date/time the user entered the game)
  // Needed because Firebase's '.push()' creates its unique keys client side,
  // so you can't ".push()" in a ".onDisconnect"
  chatData = database.ref("/chat");
  var chatDataDisc = database.ref("/chat/" + playerNumber);
  // Send disconnect message to chat with Firebase server generated timestamp and id of '0' to denote system message
  chatDataDisc.onDisconnect().set({
  name: userName,
  time: firebase.database.ServerValue.TIMESTAMP,
  message: "has disconnected.",
  idNum: 0
  });
  makeChatButton();
  chatClickListeners();
  chatFirebaseListeners();
};
$(document).ready(function(){
  playersRef.on("value", canWeChat);
});