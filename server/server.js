const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

io.on('connection', function(socket) {
    console.log('New User Connected.');

    socket.emit('newMessage', {
        from: "Admin",
        text: "Welcome to the chat app.",
        createdAt: new Date().getTime()
    });

    socket.on('disconnect', function(){
        console.log('User Was Disconnected.');
    });

    socket.on('createMessage', function(msg){
        console.log('Create Message', msg);
    });
});

app.use(express.static(publicPath));

server.listen(3000, () => {
    console.log('Server is up on port 3000');
});
