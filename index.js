var Ticket = require('./Ticket');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});


var ticket = new Ticket();
var users = {};

io.on('connection', function(socket) {
    console.log('a user connected');
    //send a bingo ticket to user
    socket.on('user joined', function(user) {
		users[socket.id] = user;
		io.sockets.connected[socket.id].emit('ticket given', ticket);
	});

	socket.on('disconnect', function() {
        var left = users[socket.id];
        delete users[socket.id];
        io.emit('user disconnected', {
            left: left,
            users: users
        })
    })
  
});



http.listen(3000, function() {
    console.log('listening on *:3000');
});
