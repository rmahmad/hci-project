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

    $('#messages').on('click', 'li.signal-message', function() {
        var video = document.getElementById("movie");
        var time = $(this).attr('name');
        video.currentTime = time;
    });

    $('#signal-button').click(function() {
        var video = document.getElementById("movie");
        var time = movie.currentTime;
        time = time.toFixed(0);
        minutes = Math.floor(time/60);
        seconds = time%60;
        $('#messages').append($('<li name="' + time + '" class="signal-message">').text('You signaled for your partner to view the video at time ' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds) + '. To view the video at that time, click this message.'));
    });

    $('form').submit(function() {
        if($('#messages li:last-child').attr('class') != 'self-message') {
            $('#messages').append($('<li class=self-message>').append($('<b>').text("You")));
        }
        $('#messages').append($('<li class=self-message>').text($('#chat-message-box').val()));
        $("#messages").scrollTop($("#messages")[0].scrollHeight);
        $('#chat-message-box').val('');
        $('#chat-send-button').attr('disabled', 'disabled');
        return false;
    });
});