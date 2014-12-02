var socket = io();
var id = -1;

socket.on('chat message', function(msg) {
    if(msg.id == id) {
        if($('#messages li:last-child').attr('class') != 'self-message') {
            $('#messages').append($('<li class=self-message>').append($('<b>').text("You")));
        }
        $('#messages').append($('<li class=self-message>').text(msg.msg));
        $("#messages").scrollTop($("#messages")[0].scrollHeight);
    }
    else {
        if($('#messages li:last-child').attr('class') != 'partner-message') {
            $('#messages').append($('<li class=partner-message>').append($('<b>').text("Your Partner")));
        }
        $('#messages').append($('<li class="partner-message">').text(msg.msg));
        $("#messages").scrollTop($("#messages")[0].scrollHeight);
    }
});

socket.on('connected', function(msg) {
    $('#messages').append($('<li class="system-message">').text(msg));
});

socket.on('disconnected', function(msg) {
    $('#messages').append($('<li class="system-message">').text(msg));
});

socket.on('signal', function(time) {
    time = time.toFixed(0);
    minutes = Math.floor(time/60);
    seconds = time%60;
    $('#messages').append($('<li name="' + time + '" class="signal-message">').text('Your partner is signaling you to view the video at time ' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds) + '. To view the video at that time, click this message.'));
});

socket.on('user-id', function(val) {            
    id = val;
});


$(document).ready(function() {
    $('#tutorial-modal').modal({
        keyboard: true,
        backdrop: 'static'
    });
    $('#tutorial-modal').modal('show');
    $('#close-tutorial-button').click(function() {
        $('#tutorial-modal').modal('hide');
    });
    $('#close-confirmation-button').click(function() {
        $('#confirmation-modal').modal('hide');
    });

    $('#tutorial-modal').on('hidden.bs.modal', function () {
        var timer = 600;
        var timerInterval = setInterval(function() {
            $('#timer').text('Time left: ' + Math.floor(timer/60) + ':' + (timer%60 < 10 ? '0' + timer%60 : timer%60));
            timer--;
            if(timer === -1) {
                clearInterval(timerInterval);
                $('#timer-modal').modal({
                    backdrop: 'static'
                });
                $('#timer-modal').modal('show');
            }
        }, 1000);
    });

    $('#messages').on('click', 'li.signal-message', function() {
        var video = document.getElementById("movie");
        var time = $(this).attr('name');
        video.currentTime = time;
    });

    $('#chat-form').keyup(function() {
        if($('#chat-message-box').val() != '') {
            $('#chat-send-button').removeAttr('disabled');
        }
        else {
            $('#chat-send-button').attr('disabled', 'disabled');
        }
    });

    $('#signal-button').click(function() {
        var video = document.getElementById("movie");
        var time = video.currentTime;
        socket.emit('time signal', {'id': id, 'time': time});
        time = time.toFixed(0);
        minutes = Math.floor(time/60);
        seconds = time%60;
        $('#messages').append($('<li name="' + time + '" class="signal-message">').text('You signaled for your partner to view the video at time ' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds) + '. To view the video at that time, click this message.'));
    });

    $('form').submit(function() {
        socket.emit('chat message', {'id': id, 'msg': $('#chat-message-box').val()});
        $('#chat-message-box').val('');
        $('#chat-send-button').attr('disabled', 'disabled');
        return false;
    });
});