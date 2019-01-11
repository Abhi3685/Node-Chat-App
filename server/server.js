const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname , '../public');
var app = express();
var server = http.createServer(app);

var io = socketIO(server);

io.on('connection', (socket) => {
    console.log('New user connected');
 
    //Whenever someone disconnects this piece of code executed
    socket.on('disconnect', () => {
       console.log('User was disconnected');
    });
});

app.use(express.static(publicPath));

server.listen(3000, () => {
    console.log('Server is up on port 3000');
});