/**
 * Created by Daniel Budick on 08 Sep 2015.
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

Spielbuch.log = function (msg) {
    if (Spielbuch.Settings.debug) {
        console.log(msg);
    }
};
Spielbuch.error = function (errorcode, msg) {
    if (Meteor.isClient && Spielbuch.Settings.debug) {
        console.error(errorcode, msg);
    }
    if (Meteor.isServer) {
        throw new Meteor.Error(errorcode, msg);
    }
};


/**
 * Is used to print a message via key from Spielbuch.i18n Object.
 * @param key
 */
Spielbuch.print = function (key) {
    if (Meteor.isClient) {
        var log = Session.get('spielbuchLog'), msg = Spielbuch.i18n.get(key, arguments);
        if (msg) {
            log.reverse(); //we want a stack, so we reverse the array
            log.push(msg); //push the msg, which adds it to the last position
            log.reverse(); //reverse the array back, and we have a stack where the first element is the newest one
            Session.set('spielbuchLog', log);
        }
    }
};

/**
 * Prints a string directly.
 * @param msg
 */
Spielbuch.printd = function (msg) {
    if (Meteor.isClient) {
        var log = Session.get('spielbuchLog');
        if (msg) {
            log.reverse(); //we want a stack, so we reverse the array
            log.push(msg); //push the msg, which adds it to the last position
            log.reverse(); //reverse the array back, and we have a stack where the first element is the newest one
            Session.set('spielbuchLog', log);
        }
    }
};
