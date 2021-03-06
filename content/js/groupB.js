var socket = io();
var id = -1;
var ready = false;

socket.on('chat message', function(msg) {
    if(ready) {
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
    $("#messages").scrollTop($("#messages")[0].scrollHeight);
});


socket.on('user-id', function(val) {            
    id = val;
});

socket.on('timer', function(data) {
    if(data.intro) {
        $('#timer').text('Introduction time left: ' + Math.floor(data.timer/60) + ':' + (data.timer%60 < 10 ? '0' + data.timer%60 : data.timer%60));
    }
    else {
        if($('#intro-overlay').css('display') != 'none') {
            $('#intro-overlay').hide(500);
            $('#movie').attr('controls', true);
            $('#messages').append($('<li name="0" class="signal-message">').text('The introduction time has ended! Click the play button on the video to begin watching the video.'));
            $("#messages").scrollTop($("#messages")[0].scrollHeight);
        }
        if(data.timer === -1) {
            data.timer = 0;
            var video = document.getElementById("movie");
            video.pause();
            $('#movie').attr('controls', false);
            $('#timer-modal').modal({
                backdrop: 'static'
            });
            $('#timer-modal').modal('show');
        }
        $('#timer').text('Time left: ' + Math.floor(data.timer/60) + ':' + (data.timer%60 < 10 ? '0' + data.timer%60 : data.timer%60));
    }
});

$(document).ready(function() {
    $('#intro-modal').modal({
        keyboard: true,
        backdrop: 'static'
    });
    $('#intro-modal').modal('show');
    $('#close-tutorial-button').click(function() {
        $('#tutorial-modal').modal('hide');
    });
    $('#close-confirmation-button').click(function() {
        $('#confirmation-modal').modal('hide');
    });
    $('#close-intro-button').click(function() {
        $('#intro-modal').modal('hide');
    });

    $('#intro-modal').on('hidden.bs.modal', function () {
        if(!ready) {
            socket.emit('ready');
            ready = true;
        }
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
        $("#messages").scrollTop($("#messages")[0].scrollHeight);
    });

    $('form').submit(function() {
        socket.emit('chat message', {'id': id, 'msg': $('#chat-message-box').val()});
        $('#chat-message-box').val('');
        $('#chat-send-button').attr('disabled', 'disabled');
        return false;
    });
});