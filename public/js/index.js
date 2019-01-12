var socket = io();

socket.on('connect', function () {
    console.log('Connected To Server.');

    // socket.emit('createMessage', {
    //     from: "Abhishek",
    //     text: "Yup, that works for me."
    // });
}); 

socket.on('newMessage', function (message) {
    console.log('Got New Message', message);
});

socket.on('disconnect', function () {
    console.log('Disconnected From Server');
});