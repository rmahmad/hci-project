$(document).ready(function() {
    $('#tutorial-modal').modal({
        keyboard: true,
        backdrop: 'static'
    });
    $('#tutorial-modal').modal('show');
    $('#close-modal-button').click(function() {
        $('#tutorial-modal').modal('hide');
    });
});
