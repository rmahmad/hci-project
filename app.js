var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/content/index.html');
})

app.use(express.static('content'));

io.on('connection', function(socket) {
    console.log('connected');
    socket.on('disconnect', function(socket) {
        console.log('user disconnected');
    });
    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
    });
});

http.listen(8888, function(){
  console.log('socket listening on *:8888');
});