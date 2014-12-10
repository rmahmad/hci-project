var markers = 0;

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

    $('#tutorial-modal-5').on('hidden.bs.modal', function () {
        var timer = 900;
        var timerInterval = setInterval(function() {
            $('#timer').text('Time left: ' + Math.floor(timer/60) + ':' + (timer%60 < 10 ? '0' + timer%60 : timer%60));
            timer--;
            if(timer === -1) {
                clearInterval(timerInterval);
                var video = document.getElementById("movie");
                video.pause();
                $('#timer-modal').modal({
                    backdrop: 'static'
                });
                $('#timer-modal').modal('show');
            }
        }, 1000);
    });

    $('#chat-form').keyup(function() {
        if($('#chat-message-box').val() != '') {
            $('#chat-send-button').removeAttr('disabled');
        }
        else {
            $('#chat-send-button').attr('disabled', 'disabled');
        }
    });

    $('form').submit(function() {
        $('#messages').append($('<li class=self-message>').text($('#chat-message-box').val()));
        $("#messages").scrollTop($("#messages")[0].scrollHeight);
        $('#chat-message-box').val('');
        $('#chat-send-button').attr('disabled', 'disabled');
        return false;
    });

    $('#marker-button').click(function() {
        var video = document.getElementById("movie");
        var time = video.currentTime;
        time = time.toFixed(0);
        minutes = Math.floor(time/60);
        seconds = time%60;
        $('#messages').append($('<li name="' + time + '" class="signal-message">').text('You dropped a marker at time ' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds) + '. To view the video at that time, click here.'));
        $("#messages").scrollTop($("#messages")[0].scrollHeight);
        $('#no-marker-message').hide();
        markers++;
    });

    $('#messages').on('click', 'li.signal-message', function() {
        var video = document.getElementById("movie");
        var time = $(this).attr('name');
        video.currentTime = time;
    });
});
