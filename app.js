var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.use(express.static('content'));
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
  extended: true
})); 

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/content/index.html');
});

app.post('/notelog', function(req, res) {
//    console.log(req.body)
    console.log('Notes taken by user: ' + req.body.lines);
    console.log('Markers placed by user: ' + req.body.markers);
    if(req.body.lines && req.body.markers)
        res.sendStatus(200);
    else
        res.sendStatus(400);
});

var userId = 0;
var currentUsers = 0;
var numChats = [0, 0];
var numSignals = [0, 0];
var timer = 60;
var readyUsers = 0;
var running = false;
var intro = true;

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
            running = false;
            intro = true;
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
        if(readyUsers < 2) {
            console.log('User ready');
            readyUsers++;
            if(readyUsers === 2) {
                io.emit('connected', 'Your partner has connected');
                running = true;
            }
        }
        if(running) {
            var timerInterval = setInterval(function() {
                if(intro) {
                    timer--;
                    if(timer === 0) {
                        timer = 900;
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
