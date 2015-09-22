Spielebuch.i18n = {};
Spielebuch.i18n.get = function (key, args) {
    if (Spielebuch.i18n[Spielebuch.Settings.language] && Spielebuch.i18n[Spielebuch.Settings.language][key]) {
        var text = Spielebuch.i18n[Spielebuch.Settings.language][key];
        if (typeof text === 'string') {
            return Spielebuch.i18n[Spielebuch.Settings.language][key];
        }
        if (typeof text === 'function') {
            /**
             * We have to get rid of the first argument, because it is key and we do not need key anymore.
             * args is not a real array, thus we cannot use shift. To be fast, we iterate through args and
             * store all elements except the first one (key) into argsArray.
             * @type {Array}
             */
            var argsArray = [];
            _.forEach(args, function (arg, key) {
                if (key !== 0) {
                    argsArray.push(arg);
                }
            });
            text = text.apply(text, argsArray); //the text function is executed and returns a string.
            return text;
        }
    }
    Spielebuch.error(404, 'String for key: ' + key + ' was not found for language ' + Spielebuch.Settings.language + '.');
    return false;
};