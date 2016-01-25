$(document).ready(function() {
    var socket = io();
    var nick;
    var $messages = $('#messages');
    var numbers = [];
    var userTicket = {};


    $('#nick-form').submit(function() {
        nick = $('#nick').val();
        socket.emit('user joined', nick);
        $(this).parents().eq(1).fadeOut(500, function() {
            $(this).remove();
            $('#ticket').show();
        })
        return false;
    })

    $('#start').click(function() {
        socket.emit('game start');
        $(this).remove();
    })


    socket.on('user joined', function(data) {
        //$messages.append($('<li class="user-joined">').text(data.joined + ' joined! Say hello!'));
        //updateUsers(data.users);
    });

    socket.on('user disconnected', function(data) {
        //$messages.append($('<li class="user-left">').text(data.left + ' has left:('));
        //updateUsers(data.users);
    });

    socket.on('ticket given', function(ticket) {
        console.log('ticket given');
        userTicket = ticket;
        numbers = flatten(userTicket.rows);
        drawTicket();
    })

    socket.on('number drawn', function(number) {
        $('#number').text(number);
        removeNumber(number);
        drawTicket();
    });

    socket.on('bingo', function(winner) {
        $('#number').text('BINGO!' + winner + ' won!');
    })


    function updateUsers(users) {
        $('#users').html('');
        for (var user in users) {
            $('#users').append($('<li>').text(users[user]));
        };
    }

    function flatten(arrayOfArrays) {
        return [].concat.apply([], arrayOfArrays);
    }

    function removeNumber(number) {
        var index = numbers.indexOf(number);
        if (index > -1) {
            numbers.splice(index, 1);
        }
        console.log(numbers.length);
        if (numbers.length === 12) { //27 - 15, there are 12 nulls
            console.log('bingo!');
            socket.emit('bingo', nick);
            $('#number').text('BINGO!');
        }
    }

    function drawTicket() {
        //go through the numbers array to see which numbers are left       

        $('table tr').each(function(index, row) {
            $(row).find('td').each(function(i, td) {

                var num = userTicket.rows[index][i];
                if (num) {
                    $(td).text(num);
                    if (numbers.indexOf(num) === -1) $(td).addClass('cross-out');
                }
            })
        });
    }
})
