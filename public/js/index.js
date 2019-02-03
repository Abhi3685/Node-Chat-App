var socket = io();

socket.on('connect', function(){
    console.log('Connected to server.');
});

socket.on('disconnect', function(){
    console.log('Disconnected from server.');
});

socket.on('newMessage', function(msg){
    console.log('New Message', msg);
    var li = $("<li></li>");
    li.text(`${msg.from}: ${msg.text}`);

    $("#messages").append(li);
});

socket.on('newLocationMessage', function(msg){
    var li = $("<li></li>");
    var a = $('<a target="_blank">My current location</a>');

    a.attr('href', msg.url);    
    li.text(`${msg.from}: `);
    li.append(a);

    $("#messages").append(li);
});

$("#message-form").on('submit', function(e) {
    e.preventDefault();
    var msgTextBox = $("[name=message]");
    socket.emit('createMessage', {
        from: "User",
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