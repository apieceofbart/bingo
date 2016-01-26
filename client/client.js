$(document).ready(function() {
    var socket = io();
    var nick;
    var $messages = $('#messages');
    var numbers = [];
    var userTicket = {};


    $('#nick-form').submit(function() {
        nick = $('#nick').val();
        if (nick) {
            socket.emit('user joined', nick);
            $(this).parents().eq(1).fadeOut(500, function() {
                $(this).remove();
                $('#ticket').show();
            })
        } else {
            $('.alert').show();
        }
        return false;
    })




    socket.on('user joined', function(data) {
        //$messages.append($('<li class="user-joined">').text(data.joined + ' joined! Say hello!'));
        updateUsers(data.users);
    });

    socket.on('user disconnected', function(data) {
        //$messages.append($('<li class="user-left">').text(data.left + ' has left:('));
        updateUsers(data.users);
    });

    socket.on('first user', function() {
        var startBtn = $('<button/>', {
            text: "Start!",
            id: "start",
            class: "btn btn-danger",
            click: function() {
                socket.emit('game start');
                $(this).hide();
            }
        });
        var helloMsg = $('<p/>', {
            text: 'You\'re the first to join, you decide where the game starts!'
        })
        $('h1').eq(0).after(startBtn).after(helloMsg);

    })

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
        $('#number').html('BINGO!\n' + winner + ' won!');
    })


    function updateUsers(users) {
        $('#users').html('');
        for (var user in users) {
            $('#users').append($('<li>', {
                class: "list-group-item"
            }).text(users[user]));
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
            socket.emit('bingo', nick);
            $('#number').html('BINGO!\n You won!');
            $('#start').show();
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
