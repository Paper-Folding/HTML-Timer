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
    document.documentElement.dataset.bsTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';  // dark or light bootstrap theme
})

function inputLeft(target) {
    let val = target.val();
    target.val(val.padStart(2, '0'));
}
//#endregion