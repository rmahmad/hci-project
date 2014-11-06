var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/content/index.html');
})

app.use(express.static('content'));

var users = 0;
io.on('connection', function(socket) {
    users++;
    if(users == 2) {
        console.log('Two users online');
        io.emit('connected', 'Your partner has connected');
    }
    socket.on('disconnect', function(socket) {
        users--;
//        socket.emit('disconnected', 'Your partner has disconnected')
    });
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });
});

http.listen(8888, function(){
  console.log('socket listening on *:8888');
});
