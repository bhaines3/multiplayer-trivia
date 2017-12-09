var avatarCall = function(username) {
    var avatar = $("<img/>");
    avatar
        .attr("src", `https://api.adorable.io/avatars/131/${username}.png`)
        .attr("alt", `${username}`)
        .appendTo("body");
}
$(document).ready(function() {
    avatarCall("jason");
    avatarCall("brandon");
    avatarCall("andrew");
    avatarCall("michelle");
});