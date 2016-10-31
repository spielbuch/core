/**
 * Created by Daniel Budick on 01 Okt 2015.
 * Copyright 2015 Daniel Budick All rights reserved.
 * Contact: daniel@budick.eu / http://budick.eu
 *
 * This file is part of spielbuch:core
 * spielbuch:core is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * spielbuch:core is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with spielbuch:core. If not, see <http://www.gnu.org/licenses/>.
 */

Spielbuch.i18n = {};
Spielbuch.i18n.get = function (key, args) {
    if (Spielbuch.language[key]) {
        var text = Spielbuch.language[key];
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
    Spielbuch.error(404, 'String for key: ' + key + ' was not found.');
    return false;
};

Spielbuch.language = {
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
        return `${attacker} attacked ${target} and inflicted ${damage} ${Spielbuch.Gameplay.damage}`
    },
    criticalDamage: function(attacker,target, damage){
        return `${attacker} attacked ${target} and inflicted a critical ${Spielbuch.Gameplay.damage} of ${damage} `
    },
    event: function(player, event, target){
        return `${player} used ${event} on ${target}.`;
    },
    equippingFailed: function(name,bodyPart){
        return `You cannot equip ${name} to ${bodyPart}.`
    },
    equippingForbidden: function(name){
        return `You cannot equip ${name}.`
    }


}