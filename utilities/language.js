/**
 * Created by Daniel Budick on 01 Okt 2015.
 * Copyright 2015 Daniel Budick All rights reserved.
 * Contact: daniel@budick.eu / http://budick.eu
 *
 * This file is part of spielebuch:core
 * spielebuch:core is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * spielebuch:core is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with spielebuch:core. If not, see <http://www.gnu.org/licenses/>.
 */

Spielebuch.i18n = {};
Spielebuch.i18n.get = function (key, args) {
    if (Spielebuch.language[key]) {
        var text = Spielebuch.language[key];
        if (typeof text === 'string') {
            return text;
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
    Spielebuch.error(404, 'String for key: ' + key + ' was not found.');
    return false;
};

Spielebuch.language = {
    countdownStarted: 'A countdown started.',
    countdownEnded: 'Countdown stopped.',
    countdownTime: function(timeLeft){
        return `${timeLeft} seconds left...`;
    },
    destroyedObject: function(name){
        return `${name} destroyed.`;
    },
    destroyedPlayer: function(name){
        return `${name} was killed.`;
    },
    damage: function(attacker,target, damage){
        return `${attacker} attacked ${target} and inflicted ${damage} ${Spielebuch.Gameplay.damage}`
    },
    event: function(player, event, target){
        return `${player} used ${event} on ${target}.`;
    }


}