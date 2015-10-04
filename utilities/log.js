/**
 * Created by Daniel Budick on 08 Sep 2015.
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

Spielebuch.log = function (msg) {
    if (Spielebuch.Settings.debug) {
        console.log(msg);
    }
};
Spielebuch.error = function (errorcode, msg) {
    if (Spielebuch.Settings.debug) {
        if (Meteor.isClient) {
            console.error(errorcode, msg);
        }
        if (Meteor.isServer) {
            throw new Meteor.Error(errorcode, msg);
        }
    }
};


/**
 * Is used to print a message via key from Spielebuch.i18n Object.
 * @param key
 */
Spielebuch.print = function (key) {
    if (Meteor.isClient) {
        var log = Session.get('spielebuchLog'), msg = Spielebuch.i18n.get(key, arguments);
        if (msg) {
            log.reverse(); //we want a stack, so we reverse the array
            log.push(msg); //push the msg, which adds it to the last position
            log.reverse(); //reverse the array back, and we have a stack where the first element is the newest one
            Session.set('spielebuchLog', log);
        }
    }
};

/**
 * Prints a string directly.
 * @param msg
 */
Spielebuch.printd = function (msg) {
    if (Meteor.isClient) {
        var log = Session.get('spielebuchLog');
        if (msg) {
            log.reverse(); //we want a stack, so we reverse the array
            log.push(msg); //push the msg, which adds it to the last position
            log.reverse(); //reverse the array back, and we have a stack where the first element is the newest one
            Session.set('spielebuchLog', log);
        }
    }
};
