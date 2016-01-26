var Ticket = require('./Ticket');
var Numbers = require('./Numbers');

var shuffle = require('./shuffle');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('client'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});


var users = {};

io.on('connection', function(socket) {

    console.log('a user connected');
    //send a bingo ticket to user
    socket.on('user joined', function(user) {
        var ticket = new Ticket();
        users[socket.id] = user;
        io.sockets.connected[socket.id].emit('ticket given', ticket);
        console.log('sending ticket to user');
    });

    socket.on('disconnect', function() {
        var left = users[socket.id];
        console.log(users[socket.id] + ' left');
        delete users[socket.id];
        io.emit('user disconnected', {
            left: left,
            users: users
        })
    });


    socket.on('game start', startNewGame)

    socket.on('bingo', function(winner) {
        socket.broadcast.emit('bingo', winner);
        console.log('bingo called, clearing interval, the winner is:', winner);
        bingoCalled = true;
        clearInterval(interval);
    })

});

var interval;

var startNewGame = function() {

    var bingoCalled = false;
    var randomNumbers = shuffle(Numbers());

    interval = setInterval(function() {
        if (!bingoCalled) {
            console.log('new number! numbers left:', randomNumbers.length);
            io.emit('number drawn', randomNumbers.shift());
        } else {
            console.log('still running after bingo!');
        }
    }, 500);

};



http.listen(3000, function() {
    console.log('listening on *:3000');
});
