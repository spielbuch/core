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

Spielbuch.StoredFunctions = new Mongo.Collection('storedFunctions');


/**
 * The following code forbids the client to insert or update anything in this collection.
 * This is high risk code, don't change it if you aren't absolutly sure what you are doing.
 *
 * You still want to change something?
 * You have been warned. Read the docs, to make sure that you know what you are doing.
 */

Spielbuch.StoredFunction = {};

if (Meteor.isServer) {
    Meteor.methods({
        createFncString: function (fncId, _id) {
            var doc = Spielbuch.StoredFunctions.findOne(fncId), selfString = '';
            if (doc && doc.fncString) {

                /**
                 * The user can access a lot of variables in stored functions:
                 */

                /**
                 * If the object is a gameObject, the user can access it by calling self
                 */
                if (Meteor.call('isGameObject', _id)) {
                    selfString = 'var self = new Spielbuch.GameObject(Meteor.userId());' +
                        'self.load(\'' + _id + '\');'
                }
                /**
                 * The user has access to the story, the player and the playing scene
                 * @type {string}
                 */
                var eventVariable = 'var story = new Spielbuch.Story(Meteor.userId());story.load(Meteor.userId());' +
                    'var player = new Spielbuch.Player(Meteor.userId());' +
                    'var scene = new Spielbuch.Scene(Meteor.userId());' +
                    'scene.load(Session.get(\'playingSceneId\'));' +
                    selfString;


                /**
                 * The user has access to variables that where published by Spielbuch.publish()
                 */
                var story = new Spielbuch.Story(this.userId, true);
                _.forEach(story.get('eventVariables'), function (value, varname) {
                    if (typeof value === 'boolean' || typeof value === 'number') {
                        eventVariable += 'var ' + varname + '=' + value + ';';
                    }
                    if (typeof value === 'string') {
                        eventVariable += 'var ' + varname + '=\'' + value + '\';';
                    }
                });
                return eventVariable + doc.fncString;
            }
        }
    });

    /**
     * Only the removeal of own stored functions should be allowed to the client
     */
    Spielbuch.StoredFunctions.allow({
        remove: function (userId, doc) {
            /**
             * An user is allowed to delete his own stored functions.
             */
            return (userId && doc.owner === userId);
        }
    });

    Spielbuch.StoredFunctions.deny({
        insert: function () {
            /**
             * An user should never be able to create an StoredFunction
             */
            return true;
        },
        update: function (userId, docs, fields, modifier) {
            /**
             * An should never be able to update a StoredFunction
             */
            return true;
        }
    });

    /**
     * Publish the whole collection to the user for transparency.
     * These function can be executed on the user, so they have a right to know, before something goes wrong.
     */
    Meteor.publish('allStoredFunctions', function () {
        return Spielbuch.StoredFunctions.find();
    });

    /**
     * Saves functionstring to database.
     */
    Spielbuch.StoredFunction.save = function (fnc, userId) {
        var functionString = '';
        if (typeof fnc === 'function') {
            /**
             * Escape the codefrom the function
             */
            functionString = fnc.toString().match(/function[^{]+\{([\s\S]*)\}$/)[1];
        }
        else if (typeof fnc === 'string') {
            functionString = fnc;
        }
        else {
            Spielbuch.error(500, 'This is neither a function nor a string, it cannot be stored');
        }
        /**
         * Escape the commetents
         * @type {string}
         */
        functionString = functionString.replace(/(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm, '');
        /**
         * Escaoe tabs, linebreaks and double spaces
         * @type {string}
         */
        functionString = functionString.replace(/(\r\n|\n|\r|\s\s)/gm, "");
        var _id = Spielbuch.StoredFunctions.insert({
            userId: userId,
            fncString: functionString
        });
        if (_id) {
            Spielbuch.log('Stored function with _id ' + _id + ' for player ' + userId + '.')
            return _id;
        }
        Spielbuch.error(500, 'Could not store function into database.');
        return false;
    };
}

/**
 * Functions stored in the databse should only be executed on the client.
 */
if (Meteor.isClient) {
    Spielbuch.StoredFunction.execute = function (fncId, _id) {
        Meteor.call('createFncString', fncId, _id, function (err, fncString) {
            if (err) {
                Spielbuch.error(500, err);
            }
            var fnc = new Function(fncString);
            try {
                (fnc());
            } catch (e) {
                Spielbuch.error(500, e);
            }
        });
    };
}