var chatData;
var player1Exists;
var player2Exists;
var player3Exists;
var player4Exists;
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
        .css({"position":"absolute","bottom":"10px","right":"20px","z-index":"1000"})
        .appendTo("#header")
    otherChatButton
        .html("💬")
        .attr("id","bubbleButton2")
        .attr("class", "btn btn-outline-dark")
        .css({"position":"absolute","bottom":"10px","right":"320px","z-index":"1000"})
        .appendTo("#header")
        .hide();
    chatArea
        .css({"position":"absolute","bottom":"10px","right":"20px","width":"300px","height":"250px","background-color":"#f5f5f599","z-index":"1000"})
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
  player1Exists = snapshot.child("0").exists();
  player2Exists = snapshot.child("1").exists();
  player3Exists = snapshot.child("2").exists();
  player4Exists = snapshot.child("3").exists();
  if (player1Exists && player2Exists && player3Exists && player4Exists) {
    chatPossible();
  } else if (!player1Exists || !player2Exists || !player3Exists || !player4Exists) {
    chatData.remove();
    $("#bubbleButton1").remove();
    $("#bubbleButton2").remove();
    $("#chat-area").remove();
  }
};
function chatPossible() {
  chatData = database.ref("/chat");
  makeChatButton();
  chatClickListeners();
  chatFirebaseListeners();
};
$(document).ready(function(){
  playersRef.on("value", canWeChat);
});