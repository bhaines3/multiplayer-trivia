var userInfo = {
    userNames: ["brandon", "jason", "michelle", "andrew"],
};
var avatarCall = function(username) {
    var avatar = $("<img/>");
    avatar
        .attr("src", `https://api.adorable.io/avatars/131/${username}.png`)
        .attr("alt", `${username}`)
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