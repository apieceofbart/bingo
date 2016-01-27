var Ticket = require('./Ticket');
var Numbers = require('./Numbers');
var config = require('./config');
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
var gameIsOn = false;

io.on('connection', function(socket) {

    console.log('a user connected');
    //send a bingo ticket to user
    socket.on('user joined', function(user) {
        //if this is the first user to join he becomes the host
        if (Object.keys(users).length === 0) {
            io.sockets.connected[socket.id].emit('first user');
        }

        users[socket.id] = user;
        io.emit('user joined', {
            joined: user,
            users: users
        });

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

    socket.on('game start', function() {
        startNewGame(socket);
    })

    socket.on('bingo', function(winner) {
        socket.broadcast.emit('bingo', winner);
        console.log('bingo called, clearing interval, the winner is:', winner);
        bingoCalled = true;
        clearInterval(interval);
        gameIsOn = false;
    })

});

var interval;

var startNewGame = function(socket) {

    if (!gameIsOn) {
        sendTicket();
        console.log('game will start in ', config.gameStartDelay, ' miliseconds');
        io.emit('before game starts');
        var timer = setTimeout(function() {
            var bingoCalled = false;
            var randomNumbers = shuffle(Numbers());
            gameIsOn = true;

            interval = setInterval(function() {
                if (!bingoCalled) {
                    io.emit('number drawn', randomNumbers.shift());
                }
            }, config.numbersDrawInterval);

        }, config.gameStartDelay);

    } else {
        io.sockets.connected[socket.id].emit('game is on');
    }

};

function sendTicket() {

    Object.keys(io.sockets.connected).forEach(function(socket) {
        var ticket = new Ticket();
        io.sockets.connected[socket].emit('ticket given', ticket);
        console.log('sending ticket to user');
    })

}



http.listen(3000, function() {
    console.log('listening on *:3000');
});
