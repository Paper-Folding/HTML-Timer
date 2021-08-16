//#region deal timer self logic 🗳
/* ⏳/⏰ */
let Timer = {
    timer: null, // 🔄
    counter: null, // ⌚
    startSecond: null, // used for time calibration
    mode: 0, // 0: ⏳; 1: ⏰
    init: function () { // 🔧
        this.counter = {
            hour: +$('#hour').val(),
            minute: +$('#minute').val(),
            second: +$('#second').val(),
            totalSeconds: +$('#hour').val() * 3600 + +$('#minute').val() * 60 + +$('#second').val(),
            currentLeftSeconds: +$('#hour').val() * 3600 + +$('#minute').val() * 60 + +$('#second').val(),
        };
        if (this.mode !== 0) {
            let now = new Date(), adjust = now.getMilliseconds();
            while (adjust % 1000 !== 0) { // this while to adjust time to a perfectly accurate time point that synchronize with current time perfectly
                now = new Date();
                adjust = now.getMilliseconds();
            }
            let nowh = now.getHours(), nowm = now.getMinutes(), nows = now.getSeconds(), nowt = nowh * 3600 + nowm * 60 + nows;
            this.counter.currentLeftSeconds = this.counter.totalSeconds = (this.counter.totalSeconds - nowt + 24 * 3600) % (24 * 3600);
            this.reduce(0);
        }
    },
    reduce: function (seconds) { // 🔻
        this.counter.currentLeftSeconds = this.counter.totalSeconds - seconds;
        if (this.counter.currentLeftSeconds <= 0)
            this.counter.currentLeftSeconds = this.counter.second = this.counter.minute = this.counter.hour = 0;
        else {
            this.counter.second = this.counter.currentLeftSeconds % 60;
            this.counter.minute = Math.floor(this.counter.currentLeftSeconds / 60) % 60;
            this.counter.hour = Math.floor(this.counter.currentLeftSeconds / 3600);
        }
    },
    calibrate: function () {
        let now = Math.floor(new Date().getTime() / 1000);
        this.reduce(now - this.startSecond);
    },
    timeUp: function () { // 😆
        $('#btn-start').hide();
        $('#btn-resume').hide();
        $('#btn-pause').hide();
        $('#btn-stop').show().text('return');
        clearInterval(this.timer);
    },
    output: function () { // 📃
        if (this.counter == null || this.counter.currentLeftSeconds === 0) {
            this.timeUp();
            return "Time's up!";
        }
        return (this.counter.hour === 0 ? '' : (('' + this.counter.hour).padStart(2, '0') + '<span class="fs-1">h&nbsp;</span>')) + (this.counter.minute === 0 && this.counter.hour === 0 ? '' : (('' + this.counter.minute).padStart(2, '0') + '<span class="fs-1">m&nbsp;</span>')) + ('' + this.counter.second).padStart(2, '0') + '<span class="fs-1">s</span>';
    },
    start: function () { // ▶
        this.init();
        if (this.counter.totalSeconds === 0) {
            alert('You have not set timer!');
            return;
        }
        let target = $('#timer');
        target.show();
        target.html(this.output());
        this.startSecond = Math.floor(new Date().getTime() / 1000);
        this.timer = setInterval((function (_this) {
            return function () {
                _this.calibrate();
                target.html(_this.output());
            }
        })(this), 1000);
        $('#inputer').hide();
        if (this.mode === 0) {
            $('#btn-start').hide();
            $('#btn-resume').hide();
            $('#btn-pause').show();
            $('#btn-stop').hide();
        }
        else {
            $('#btn-start').hide();
            $('#btn-resume').hide();
            $('#btn-pause').hide();
            $('#btn-stop').show();
        }
    },
    resume: function () { // ↪
        let target = $('#timer');
        this.startSecond = Math.floor(new Date().getTime() / 1000);
        this.counter.totalSeconds = this.counter.currentLeftSeconds;
        this.reduce(0);
        this.timer = setInterval((function (_this) {
            return function () {
                _this.calibrate();
                target.html(_this.output());
            }
        })(this), 1000);
        $('#btn-start').hide();
        $('#btn-resume').hide();
        $('#btn-pause').show();
        $('#btn-stop').hide();
    },
    pause: function () { // ⏸
        clearInterval(this.timer);
        $('#btn-start').hide();
        $('#btn-resume').show();
        $('#btn-pause').hide();
        $('#btn-stop').show().text('stop');
    },
    stop: function () { // ⏹
        clearInterval(this.timer);
        $('#inputer').show();
        $('#timer').hide();
        $('#btn-start').show();
        $('#btn-resume').hide();
        $('#btn-pause').hide();
        $('#btn-stop').hide();
    }
}
//#endregion

//#region timer controller 🎮
$('#btn-start').click(function () {
    if (document.URL.search('showTimer') !== -1) {
        Timer.start();
        return;
    }
    if (confirm('Open new window to start and control your timer?')) {
        window.open('showTimer.html', 'winname', 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=520,height=330');
        let timerInfo = {
            hour: +$('#hour').val(),
            minute: +$('#minute').val(),
            second: +$('#second').val(),
            totalSeconds: +$('#hour').val() * 3600 + +$('#minute').val() * 60 + +$('#second').val(),
            currentLeftSeconds: +$('#hour').val() * 3600 + +$('#minute').val() * 60 + +$('#second').val(),
            mode: Timer.mode
        };
        localStorage.setItem('timerInfo', JSON.stringify(timerInfo));
    }
    else
        Timer.start();
})

$('#btn-resume').click(function () {
    Timer.resume();
})

$('#btn-pause').click(function () {
    Timer.pause();
})

$('#btn-stop').click(function () {
    Timer.stop();
})
//#endregion