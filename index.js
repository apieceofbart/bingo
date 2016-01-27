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
var results = [];

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

    socket.on('bingo', function() {
        console.log('bingo called, clearing interval');
        bingoCalled = true;
        clearInterval(interval);
        gameIsOn = false;
        io.emit('game over');
    })

    socket.on('send results', function(result) {
        //we might get double calls because of multiple winners..
        //this is very wrong, will fix when hangover is gone
        addToResults(result);
        console.log('send results');
        //this below sucks, but no other idea how to handle that
        //we need to check if we got results from everyone and when we have we sned back the winners 
        //TODO: what if someone leaves? this might get ugly 
        console.log(results.length, io.engine.clientsCount);
        if (results.length === io.engine.clientsCount) {
            var winners = results.filter(function(player) {
                return player.isWinner
            }).map(function(winner) {
                return winner.name
            });
            io.emit('announce winners', winners);
        }

    })

    function addToResults(result) {
        console.log(result);
        var isPresent = false;
        results.forEach(function(r) {
            if (r.name === result.name) isPresent = true;
        })
        if (!isPresent) results.push(result);
    }



});

var interval;

var startNewGame = function(socket) {

    if (!gameIsOn) {
        winners = [];
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
