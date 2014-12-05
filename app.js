var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/content/index.html');
})

app.use(express.static('content'));

var userId = 0;
var currentUsers = 0;
var numChats = [0, 0];
var numSignals = [0, 0];
var timer = 60;
var readyUsers = 0;

io.on('connection', function(socket) {
    var startDate = new Date();
    socket.emit('user-id', userId);
    userId++;
    currentUsers++;
    if(currentUsers == 2) {
        console.log('------------------- Session began -------------------');
        console.log('Session began at ' + startDate.getHours() + ':' + startDate.getMinutes() + ':' + startDate.getSeconds());
    }
    socket.on('disconnect', function(socket) {
        currentUsers--;
        readyUsers--;
        io.emit('disconnected', 'Your partner has disconnected');
        if(currentUsers == 0) {
            endDate = new Date();
            var time = endDate - startDate;
            var messages = numChats[0] + numChats[1];
            var signals = numSignals[0] + numSignals[1];
            var user1 = userId-2;
            var user2 = userId-1;
            console.log('Session ended at ' + endDate.getHours() + ':' + endDate.getMinutes() + ':' + endDate.getSeconds());
            console.log('------------------- Session over -------------------');
            console.log('Session statistics:\nTime: ' + time/1000 + ' seconds');
            console.log('Number of messages:\n\tUser ' + user1 + ': ' + numChats[0] + '\n\tUser ' + user2 + ': ' + numChats[1] + '\n\tTotal: ' + messages);
            console.log('Number of signals:\n\tUser ' + user1 + ': ' + numSignals[0] + '\n\tUser ' + user2 + ': ' + numSignals[1] + '\n\tTotal: ' + signals);
            numChats = [0, 0];
            numSignals = [0, 0];
            timer = 60;
        }
    });
    socket.on('chat message', function(msg){
        if(currentUsers == 2) {
            if(msg.id == userId - 1) {
                numChats[1]++;
            }
            else {
                numChats[0]++;
            }
            console.log('User ' + msg.id + ': ' + msg.msg);
        }
        io.emit('chat message', msg);
    });
    socket.on('time signal', function(msg) {
        if(currentUsers == 2) {
            if(msg.id == userId - 1) {
                numSignals[1]++;
            }
            else {
                numSignals[0]++;
            }
            console.log('User ' + msg.id + ' signaled at time ' + msg.time);
        }
        socket.broadcast.emit('signal', msg.time);
    });

    socket.on('ready', function(msg) {
        console.log(readyUsers);
        if(readyUsers < 2) {
            readyUsers++;
            if(readyUsers === 2) {
                io.emit('connected', 'Your partner has connected');
            }
        }
        if(readyUsers === 2) {
            var intro = true;
            var timerInterval = setInterval(function() {
                if(intro) {
                    timer--;
                    if(timer === 0) {
                        timer = 15;
                        intro = false;
                    }
                }
                else {
                    timer--;
                    if(timer === -1) {
                        clearInterval(timerInterval);
                    }
                }
                if(readyUsers < 2) {
                    clearInterval(timerInterval);
                }
                io.emit('timer', {'timer': timer, 'intro': intro});
            }, 1000);
        }
    });
});

http.listen(process.env.PORT || 8888, function(){
  console.log('socket listening on *:8888');
});
