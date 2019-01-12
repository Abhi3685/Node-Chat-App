const express = require('express');
var app = express();
const path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);

const publicPath = path.join(__dirname , '../public');

io.on('connection', (socket) => {
    console.log('New user connected');

    // socket.emit('newMessage', {
    //     from: "Abhishek",
    //     text: "Can we meet up at 6:00",
    //     createdAt: 123
    // });

    socket.emit('newMessage', {
        from: 'Admin',
        text: "Welcome to the chat app",
        createdAt: new Date().getTime()
    });

    socket.broadcast.emit('newMessage', {
        from: 'Admin',
        text: "New User Joined",
        createdAt: new Date().getTime()
    });

    socket.on('createMessage', (message) => {
        console.log('Create Message', message);

        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        }); 

        // socket.broadcast.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // }); 
    });
 
    //Whenever someone disconnects this piece of code executed
    socket.on('disconnect', () => {
       console.log('User was disconnected');
    });
});

app.use(express.static(publicPath));

server.listen(3000, () => {
    console.log('Server is up on port 3000');
});