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

    $('#marker-button').click(function() {
        var video = document.getElementById("movie");
        var time = video.currentTime;
        time = time.toFixed(0);
        minutes = Math.floor(time/60);
        seconds = time%60;
        $('#markers').append($('<li name="' + time + '" class="message">').text('You dropped a marker at time ' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds) + '. To view the video at that time, click here.'));
        $('#no-marker-message').hide();
        markers++;
    });

    $('#markers').on('click', 'li.message', function() {
        var video = document.getElementById("movie");
        var time = $(this).attr('name');
        video.currentTime = time;
    });

    $('#finished-button').click(function() {
        console.log(markers);
    });
});
