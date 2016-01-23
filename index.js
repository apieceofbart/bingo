var Ticket = require('./Ticket');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});


var ticket = new Ticket();

io.on('connection', function(socket) {
    console.log('a user connected');
    //send a bingo ticket to user

  
})

http.listen(3000, function() {
    console.log('listening on *:3000');
});
