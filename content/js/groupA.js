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
});
