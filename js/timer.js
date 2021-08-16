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
            let now = new Date(), nowh = now.getHours(), nowm = now.getMinutes(), nows = now.getSeconds(), nowt = nowh * 3600 + nowm * 60 + nows;
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
        this.timer = setInterval((function (_this) {
            return function () {
                this.startSecond = Math.floor(new Date().getTime() / 1000);
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

//#region page behavior controller 📦
Timer.mode = sessionStorage.getItem('mode') === '1' ? 1 : 0;
sessionStorage.removeItem('mode');

$('#mode').bind('change', function () {
    sessionStorage.setItem('mode', +$(this).val());
    location.reload();
}).val(Timer.mode);

$('input[type=text]').bind('input', function () { // 🔣
    inputChanged($(this), true);
}).bind('blur', function () { // －O－┛ ~Bye!
    inputLeft($(this));
}).bind('keydown', function (e) { // '' && 🔙
    if ($(this).val().length > 0)
        return;
    let key = e.keyCode || e.charCode;
    if (key === 8 || key === 46) {
        if ($(this).attr('id') === 'minute')
            $('#hour').focus().select();
        else if ($(this).attr('id') === 'second')
            $('#minute').focus().select();
    }
}).bind('focus', function () { // 👆
    $(this).select();
})

if (Timer.mode === 0) { // duration mode
    function inputChanged(target, ifFocus) {
        target.val(target.val().replace(/[^0-9]/g, ""));
        if (target.val().length >= 2) { // ==>
            if (target.attr('id') === 'hour') {
                if (+target.val() >= 99)
                    target.val('99');
                if (ifFocus) {
                    $('#minute').focus().select();
                    inputLeft(target);
                }
            }
            else if (target.attr('id') === 'minute') {
                if (+target.val() >= 60)
                    target.val('59');
                if (ifFocus) {
                    $('#second').focus().select();
                    inputLeft(target);
                }
            }
            else if (target.attr('id') === 'second') {
                if (+target.val() >= 60)
                    target.val('59');
            }
        }
        else if (target.val().length === 0) { // <==
            if (target.attr('id') === 'second' && ifFocus)
                $('#minute').focus().select();
            else if (target.attr('id') === 'minute' && ifFocus)
                $('#hour').focus().select();
        }
        if (target.val().length > 2) { // 052 ==> 52
            if (+target.val() === 0)
                target.val('00');
            else
                target.val('' + (+target.val()));
        }
    }

    function addByOne(targetSelector) { // +1
        let target = $('#' + targetSelector);
        let val = '' + (+target.val() + 1);
        target.val(val);
        inputLeft(target);
        inputChanged(target, false);
    }

    function reduceByOne(targetSelector) { // -1
        let target = $('#' + targetSelector);
        if (+target.val() === 0) {
            target.val('00');
            return;
        }
        let val = '' + (+target.val() - 1);
        target.val(val);
        inputLeft(target);
        inputChanged(target, false);
    }
}
else { // until mode
    function inputChanged(target, ifFocus) {
        target.val(target.val().replace(/[^0-9]/g, ""));
        if (target.val().length >= 2) { // ==>
            if (target.attr('id') === 'hour') {
                if (+target.val() >= 24)
                    target.val('23');
                if (ifFocus) {
                    $('#minute').focus().select();
                    inputLeft(target);
                }
            }
            else if (target.attr('id') === 'minute') {
                if (+target.val() >= 60)
                    target.val('59');
                if (ifFocus) {
                    $('#second').focus().select();
                    inputLeft(target);
                }
            }
            else if (target.attr('id') === 'second') {
                if (+target.val() >= 60)
                    target.val('59');
            }
        }
        else if (target.val().length === 0) { // <==
            if (target.attr('id') === 'second' && ifFocus)
                $('#minute').focus().select();
            else if (target.attr('id') === 'minute' && ifFocus)
                $('#hour').focus().select();
        }
        if (target.val().length > 2) { // 052 ==> 52
            if (+target.val() === 0)
                target.val('00');
            else
                target.val('' + (+target.val()));
        }
    }

    function addByOne(targetSelector) { // +1
        let target = $('#' + targetSelector);
        let val = +target.val() + 1;
        if (target.attr('id') === 'hour')
            val = '' + val % 24;
        else if (target.attr('id') === 'minute') {
            if (val >= 60)
                addByOne('hour');
            val = '' + val % 60;
        }
        else if (target.attr('id') === 'second') {
            if (val >= 60)
                addByOne('minute');
            val = '' + val % 60;
        }
        target.val(val);
        inputLeft(target);
        inputChanged(target, false);
    }

    function reduceByOne(targetSelector) { // -1
        let target = $('#' + targetSelector);
        let val = (+target.val() - 1);
        if (val < 0) {
            if (target.attr('id') === 'hour')
                val = '23';
            else if (target.attr('id') === 'minute') {
                reduceByOne('hour');
                val = '59';
            }
            else if (target.attr('id') === 'second') {
                reduceByOne('minute');
                val = '59';
            }
        }
        target.val(val);
        inputLeft(target);
        inputChanged(target, false);
    }
}

$(document).ready(function () {
    $('#inputer').show();
    $('#timer').hide();
    $('#btn-start').show();
    $('#btn-resume').hide();
    $('#btn-pause').hide();
    $('#btn-stop').hide().text('return');
})

function inputLeft(target) {
    let val = target.val();
    target.val(val.padStart(2, '0'));
}

$('body').dblclick(function () {
    document.getElementById('function-btns').classList.toggle('d-none');
})
//#endregion