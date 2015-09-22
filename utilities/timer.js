Spielebuch.startUiCountdown = function (timeInMs, steps, cb) {
    var time = timeInMs;
    Spielebuch.print('countdownStarted');
    Session.set('spielebuchCriticalTiming', (time / timeInMs) * 100);
    var killSwitch = Meteor.setInterval(function () {
        time -= steps;
        Session.set('spielebuchCriticalTiming', (time / timeInMs) * 100);
        if (time < 0) {
            Session.set('spielebuchCriticalTiming', 0);
            Spielebuch.stopCountdown(killSwitch);
            return cb();
        }
        Spielebuch.print('countdownTime', [time / 1000]);
    }, steps);
    return killSwitch;
};

Spielebuch.startSilentCountdown = function (timeInMs, steps, cb) {
    Spielebuch.print('countdownStarted');
    var time = timeInMs,
        killSwitch = Meteor.setInterval(function () {
            time -= steps;
            if (time < 0) {
                Spielebuch.stopCountdown(killSwitch);
                return cb();
            }
            Spielebuch.print('countdownTime', [time / 1000]);
        }, steps);
    return killSwitch;
};

Spielebuch.stopCountdown = function (killSwitch) {
    Meteor.clearInterval(killSwitch);
    Meteor.setTimeout(function () {
        Session.set('spielebuchCriticalTiming', 0);
        Spielebuch.print('countdownEnded');
    }, 2000);
};