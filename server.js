var express = require('express');
var app = express();

// Server Chat
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var UserLogin = [];
io.on("connection", function(socket) {


    console.log('Có người vừa kết nối, ID là: ' + socket.id);
    socket.on("disconnect", function() {
        console.log(socket.id + " đã ngắt kết nối server!");
    });

    socket.on('Client-send-login', function(data) {
        console.log(data);
        UserLogin.push(data);

        socket.Username = data;
        socket.emit('server-res-login', data);
        io.sockets.emit('server-send-list', UserLogin);
    });
    socket.on('logout', function() {
        UserLogin.splice(UserLogin.indexOf(socket.Username), 1);
        socket.broadcast.emit('server-send-list', UserLogin);
    });
    socket.on('client-send-messages', function(data) {
        socket.emit('server-send-messages', { user: socket.Username, content: data });
    });
    socket.on('client-send-messages', function(data) {
        socket.broadcast.emit('server-send-messages-right', { user: socket.Username, content: data });
    });
    socket.on('dang-go-chu', function() {
        socket.broadcast.emit('write', socket.Username);
    });
    socket.on('dung-go-chu', function() {
        socket.broadcast.emit('Unwrite');
    });
});




// Lăng nghe (on) kết nối server
server.listen(2000);