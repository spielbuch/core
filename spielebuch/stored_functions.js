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

Spielebuch.StoredFunctions = new Mongo.Collection('storedFunctions');


/**
 * The following code forbids the client to insert or update anything in this collection.
 * This is high risk code, don't change it if you aren't absolutly sure what you are doing.
 *
 * You still want to change something?
 * You have been warned. Read the docs, to make sure that you know what you are doing.
 */

Spielebuch.StoredFunction = {};

if (Meteor.isServer) {
    Spielebuch.StoredFunctions.allow({
       remove: function(userId, doc){
           /**
            * An user is allowed to delete his own stored functions.
            */
           return (userId && doc.owner === userId);
       }
    });

    Spielebuch.StoredFunctions.deny({
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
        return Spielebuch.StoredFunctions.find();
    });


    /**
     * Saves functionstring to database.
     */
    Spielebuch.StoredFunction.save = function (fnc, userId) {
        if (typeof fnc !== 'function') {
            Spielebuch.error(500, 'This is not a function, it cannot be stored');
        }
        var functionString = fnc.toString().match(/function[^{]+\{([\s\S]*)\}$/)[1];

        var _id = Spielebuch.StoredFunctions.insert({
            userId: userId,
            fncString: functionString
        });
        if (_id) {
            Spielebuch.log('Stored function with _id ' + _id + ' for player ' + userId + '.')
            return _id;
        }
        Spielebuch.error(500, 'Could not store function into database.');
        return false;
    };
}

/**
 * Functions stored in the databse should only be executed on the client.
 */
if(Meteor.isClient) {
    Spielebuch.StoredFunction.execute = function (fncId) {
        var functionString = 'console.log(\'Function not found.\')', doc, fnc;
        check(fncId, String);
        doc = Spielebuch.StoredFunctions.findOne(fncId);
        if (doc && doc.fncString) {
            fncString = doc.fncString
        }
        fnc = new Function(fncString);
        (fnc());
    }
}
