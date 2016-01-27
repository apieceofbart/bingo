$(document).ready(function() {
    var socket = io();
    var nick;
    var $messages = $('#messages');
    var numbers = [];
    var userTicket = {};
    var isAdmin = false;
    var isWinner = false;

    $('#nick-form').submit(function() {
        nick = $('#nick').val();
        if (nick) {
            socket.emit('user joined', nick);
            $(this).parents().eq(1).fadeOut(500, function() {
                $(this).remove();
                $('#ticket').show();
            })
        } else {
            $('#form-alert').show();
        }
        return false;
    })

    socket.on('user joined', function(data) {
        updateUsers(data.users);
    });

    socket.on('user disconnected', function(data) {
        updateUsers(data.users);
    });

    socket.on('before game starts', function(time) {
        showTimeout(time);
    })

    socket.on('first user', function() {
        isAdmin = true; //from now on this person starts each game
        var startBtn = $('<button/>', {
            text: "Start!",
            id: "start",
            class: "btn btn-danger",
            click: function() {
                socket.emit('game start');
                $(this).hide();
                isWinner = false;
            }
        });
        var helloMsg = $('<p/>', {
            text: 'You\'re the first to join, you decide when the game starts!'
        })
        $('h1').eq(0).after(startBtn).after(helloMsg);

    })

    socket.on('ticket given', function(ticket) {
        console.log('ticket given');
        userTicket = ticket;
        numbers = flatten(userTicket.rows);
        drawTicket();
    })

    socket.on('game is on', function() {
        $('#msg').text('Sorry, game already started. Please try in a minute!');
    })

    socket.on('number drawn', function(number) {
        $('#msg').hide();
        $('#number').text(number);
        removeNumber(number);
        drawTicket();
    });

    socket.on('announce winners', function(winners) {
        console.log('winners announced:', winners);
        $('#msg').show().html('BINGO!\n' + createWinnnersString(winners) + ' won!');
        showNewGameBtn();
    });

    socket.on('game over', function() {
        console.log('game over')
            //send results
        socket.emit('send results', {
            isWinner: isWinner,
            name: nick
        });
    })

    function createWinnnersString(winners) {
        if (winners.length === 1) return winners[0];
        if (winners.length === 2) return winners[0] + ' and ' + winners[1];
        return winners[0] + ', ' + createWinnnersString(winners.slice(1));
    }

    function showNewGameBtn() {
        if (isAdmin) $('#start').show();
        $('#start').text('Another game');
    }

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
        if (numbers.length === 12) { //27 - 15, there are 12 nulls     
            console.log('emitting bingo!');
            socket.emit('bingo', nick);
            isWinner = true;
            showNewGameBtn();
        }
    }

    function showTimeout(time) {
        var time = Math.floor(time / 1000);
        if (time > 0) {
            $('#msg').show().text('Game starts in ' + time);
            var countdown = setInterval(function() {
                $('#msg').text('Game starts in ' + --time);
                if (time < 0) clearInterval(countdown);
            }, 1000);

        }
    }

    function drawTicket() {
        //go through the numbers array to see which numbers are left       
        //also clean after last game
        $('table tr').each(function(index, row) {
            $(row).find('td').each(function(i, td) {
                $(td).removeClass('cross-out').text('');
                var num = userTicket.rows[index][i];
                if (num) {
                    $(td).text(num);
                    if (numbers.indexOf(num) === -1) $(td).addClass('cross-out');
                }
            })
        });
    }
})
