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
    document.documentElement.dataset.bsTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';  // dark or light bootstrap theme
})