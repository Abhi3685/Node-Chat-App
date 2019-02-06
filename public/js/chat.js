var socket = io();

function scrollToBottom() {
    var messages = document.getElementById("messages");
    messages.scrollTop = messages.scrollHeight;
}

socket.on('connect', function(){
    var params = $.deparam(window.location.search);

    socket.emit('join', params, function(err){
        if(err) {
            alert(err);
            window.location.href = '/';
        } else {
            // No Error
        }
    });
});

socket.on('disconnect', function(){
    console.log('Disconnected from server.');
});

socket.on('updateUserList', function(users){
    var ol = $('<ol></ol>');
    users.forEach(function(user) {
        ol.append($('<li></li>').text(user));
    });
    $("#users").html(ol);
});

socket.on('newMessage', function(msg){
    var formattedTime = moment(msg.createdAt).format('h:mm a');
    var template = $("#message-template").html();
    var html = Mustache.render(template, {
        text: msg.text,
        from: msg.from,
        createdAt: formattedTime
    });

    $("#messages").append(html);
    scrollToBottom();
});

socket.on('newLocationMessage', function(msg){
    var formattedTime = moment(msg.createdAt).format('h:mm a');
    var template = $("#location-message-template").html();
    var html = Mustache.render(template, {
        url: msg.url,
        from: msg.from,
        createdAt: formattedTime
    });

    $("#messages").append(html);
    scrollToBottom();
});

$("#message-form").on('submit', function(e) {
    e.preventDefault();
    var msgTextBox = $("[name=message]");
    socket.emit('createMessage', {
        text: msgTextBox.val()
    }, function(){
        msgTextBox.val('');
    });
});

var locationButton = $("#send-location");
locationButton.on('click', function() {
    if(!navigator.geolocation){
        return alert('Geolocation not supported by your browser.');
    }

    locationButton.attr('disabled', 'disabled').text('Sending location...');

    navigator.geolocation.getCurrentPosition(function(position) {
        locationButton.removeAttr('disabled').text('Send location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function() {
        locationButton.removeAttr('disabled').text('Send location');
        alert('Unable to fetch location.');
    });
});