(function() {
    console.log('test');
    var socket = io();
    var nick;
    var $messages = $('#messages');
    $('#nick-form').submit(function() {
        nick = $('#nick').val();
        socket.emit('user joined', nick);
        $(this).parents().eq(1).fadeOut(500, function() {
            $(this).remove();
            $('#ticket').show();
        })
        return false;
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
        $('table tr').each(function(index, row) {
            $(row).find('td').each(function(i, td) {
                var num = ticket.rows[index][i];
                if (num) $(td).text(num);
            })
        });
    })

    socket.on('number drawn', function(number) {
        $('#number').text(number);
    })


    function updateUsers(users) {
        $('#users').html('');
        for (var user in users) {
            $('#users').append($('<li>').text(users[user]));
        };
    }
})();
