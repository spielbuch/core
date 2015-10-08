Session.setDefault('spielbuchCountdownTime',-1);
Session.setDefault('spielbuchCountdownTimeLeft',-1);


/**
 * Starts a countdown. The time is sent to the ui via Session variable.
 * Only one Countdown can be displayed, so the timer's id is saved and end the last countdown,
 * when a new one ist started
 * @param timeInMs
 * @param steps
 * @param cb
 * @returns {*}
 */
var killSwitchUI = false;
Spielebuch.startUiCountdown = function (timeInMs, steps, cb) {
    var time = timeInMs;
    if(killSwitchUI){
        Spielebuch.stopCountdown(killSwitchUI);
        killSwitchUI = false;
    }

    Spielebuch.print('countdownStarted');
    Session.set('spielbuchCountdownTime', time / 1000);
    Session.set('spielbuchCountdownTimeLeft', time / 1000);
    Session.set('spielbuchCountdownPercent',100);
    killSwitchUI = Meteor.setInterval(function () {
        time -= steps;
        if (time < 0) {
            Spielebuch.stopCountdown(killSwitchUI);
            return cb();
        }
        Session.set('spielbuchCountdownPercent', time / timeInMs * 100);
        Session.set('spielbuchCountdownTimeLeft', time / 1000);
    }, steps);
    return killSwitchUI;
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
        }, steps);
    return killSwitch;
};

Spielebuch.stopCountdown = function (killSwitch) {
    Meteor.clearInterval(killSwitch);
    Spielebuch.print('countdownEnded');
    Session.setDefault('spielbuchCountdownTime',-1);
    Session.setDefault('spielbuchCountdownTimeLeft',-1);
};