const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

var {generateMessage, generateLocationMessage} = require('./utils/message');

const publicPath = path.join(__dirname, '../public');
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

io.on('connection', function(socket) {
    // console.log('New User Connected.');

    socket.emit('newMessage', generateMessage("Admin", "Welcome To The Chat App"));

    socket.broadcast.emit('newMessage', generateMessage("Admin", "New User Joined"));

    socket.on('createMessage', function(msg, callback){
        io.emit('newMessage', generateMessage(msg.from, msg.text));
        callback();
    });

    socket.on('createLocationMessage', function(coords){
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
    });

    socket.on('disconnect', function(){
        // console.log('User Was Disconnected.');
    });
});

app.use(express.static(publicPath));

server.listen(3000, () => {
    console.log('Server is up on port 3000');
});
