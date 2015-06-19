var uuid = require('node-uuid');

module.exports = function(io) {

    var
      activePeople = 0;

    function safeCb(cb) {
        if (typeof cb === 'function') {
            return cb;
        } else {
            return function () {};
        }
    }

    io.sockets.on('connection', function (client) {
        activePeople += 1;

        client.on('setDetails', function (details) {
            client.profile = {
                username: details.username,
                image: details.image
            };
            client.broadcast.emit('presence', client.profile);
        });

        // we don't want to pass "leave" directly because the
        // event type string of "socket end" gets passed too.
        client.on('disconnect', function () {
            activePeople -= 1;
            io.sockets.emit('users_count', activePeople);
            if (client.profile) {
                io.sockets.emit('vacated', client.profile);
            }
        });

        io.sockets.emit('users_count', activePeople);
        io.sockets.clients().forEach(function (socket) {
            if (socket.id !== client.id && socket.profile) client.emit('presence', socket.profile);
        });
    });
};