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

Meteor.methods({
    getUsersStoryId: function () {
        if (this.userId === null) {
            Spielebuch.error('403', 'User is not logged in.');
        }
        var user = Meteor.users.findOne(this.userId);
        Spielebuch.log('Fetching user\'s (' + this.userId + ') storyId (' + user.storyId + ').');
        return user.storyId;
    },


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
        Spielebuch.Gameobjects.remove({
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
    addEffect: function(collection, _id, effect){
        var update = {};
        update['effects'] = effect;

        //todo: Add some tests to prevent cheating.
        Spielebuch[collection].update(_id, {
            $push: update
        });
    },
    isGameobject: function(_id){
        var cursor = Spielebuch.Gameobjects.find({_id: _id}, {_id: 1, limit: 1});
        if (cursor.count() === 0) {
            return false;
        }
        return true;
    }

});