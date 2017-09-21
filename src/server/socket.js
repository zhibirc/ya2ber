let io = require('socket.io');
let http = require('http');
let app = http.createServer();

io = io.listen(app);
app.listen(12000);

io.sockets.on('connection', function (socket) {
    socket.on('eventServer', function (data) {
        console.log(data);
        socket.emit('eventClient', { data: 'Hello Client' });
    });
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});