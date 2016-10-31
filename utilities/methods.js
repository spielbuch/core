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

/**
 * Make chance available on the server
 * @type {Chance}
 */
chance = new Chance();


Meteor.methods({
    /**
     * These methods are used to delete stuff.
     */
    deleteStoryOfUser: function () {
        if (this.userId === null) {
            Spielbuch.error('403', 'User is not logged in.');
            return false;
        }
        Spielbuch.log('Deleting stories of user: ' + this.userId);

        Spielbuch.Stories.remove({
            'userId': this.userId
        });
        Spielbuch.Scenes.remove({
            'userId': this.userId
        });
        Spielbuch.GameObjects.remove({
            'userId': this.userId
        });
        Spielbuch.StoredFunctions.remove({
            'userId': this.userId
        });
        Spielbuch.Players.remove({
            'userId': this.userId
        });

        return true;
    },
    addEffect: function (collection, _id, effect) {
        var update = {};
        update['effects'] = effect;

        //todo: Add some tests to prevent cheating.
        Spielbuch[collection].update(_id, {
            $push: update
        });

    },
    isGameObject: function (_id) {
        var cursor = Spielbuch.GameObjects.find({_id: _id}, {_id: 1, limit: 1});
        return cursor.count() !== 0;

    },
    dropToScene: function(gameObjectId, sceneId){
        var update = Spielbuch.Scenes.update(sceneId, {
            $push: {text: [`<dropped>[${gameObjectId}]</dropped>`]}
        });
        if(update){
            Spielbuch.GameObjects.update(gameObjectId,{$set: {referenceId:sceneId}});
        }else{
            Spielbuch.error(500,'Update of scene in method dropToScene failed.');
        }
    }
});

Spielbuch.getDefaultEvents = function (userId) {
    if (!userId) {
        return false;
    }
    var doc = Spielbuch.Stories.findOne({userId: userId});
    if (!doc) {
        return false;
    }
    if (!doc.defaultEvents) {
        return false;
    }
    return doc.defaultEvents;
};