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
            Spielebuch.error('403', 'User is not logged in.');
            return false;
        }
        Spielebuch.log('Deleting stories of user: ' + this.userId);

        Spielebuch.Stories.remove({
            'userId': this.userId
        });
        Spielebuch.Scenes.remove({
            'userId': this.userId
        });
        Spielebuch.GameObjects.remove({
            'userId': this.userId
        });
        Spielebuch.StoredFunctions.remove({
            'userId': this.userId
        });
        Spielebuch.Players.remove({
            'userId': this.userId
        });

        return true;
    },
    addEffect: function (collection, _id, effect) {
        console.log(effect);
        var update = {};
        update['effects'] = effect;

        //todo: Add some tests to prevent cheating.
        Spielebuch[collection].update(_id, {
            $push: update
        });

    },
    isGameObject: function (_id) {
        var cursor = Spielebuch.GameObjects.find({_id: _id}, {_id: 1, limit: 1});
        return cursor.count() !== 0;

    },
    dropToScene: function(gameObjectId, sceneId){
        var update = Spielebuch.Scenes.update(sceneId, {
            $push: {text: [`<dropped>[${gameObjectId}]</dropped>`]}
        });
        if(update){
            Spielebuch.GameObjects.update(gameObjectId,{$set: {referenceId:sceneId}});
        }else{
            Spielebuch.error(500,'Update of scene in method dropToScene failed.');
        }
    }
});

Spielebuch.getDefaultEvents = function (userId) {
    if (!userId) {
        return false;
    }
    var doc = Spielebuch.Stories.findOne({userId: userId});
    if (!doc) {
        return false;
    }
    if (!doc.defaultEvents) {
        return false;
    }
    return doc.defaultEvents;
};