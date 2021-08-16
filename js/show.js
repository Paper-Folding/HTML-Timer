$(document).ready(function () {
    let timerInfo = localStorage.getItem('timerInfo');
    localStorage.clear();
    if (timerInfo != null) {
        timerInfo = $.parseJSON(timerInfo);
        $('#hour').val(timerInfo.hour);
        $('#minute').val(timerInfo.minute);
        $('#second').val(timerInfo.second);
        Timer.mode = +timerInfo.mode;
        Timer.start();
    }
})