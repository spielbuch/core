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
        }
        Spielebuch.log('Deleting stories of user: ' + this.userId);
        Spielebuch.Stories.find({
            'userId': this.userId
        }).map(function (story) {
            Meteor.call('deleteScenesOfStory', story._id);
            Spielebuch.Stories.remove(story._id);
        });
    },
    deleteScenesOfStory: function (storyId) {
        var error, result;
        if (this.userId === null) {
            Spielebuch.error('403', 'User is not logged in.');
        }
        Spielebuch.Scenes.find({
            'userId': this.userId
        }).map(function (scene) {
            Meteor.call('deleteGameobjectsOfReference', scene._id);
            result = Spielebuch.Scenes.remove(scene._id);
            if(!result){
                error = true;
            }
        });
        result = Spielebuch.Stories.update(storyId, {
            $set: {
                scenes: [],
                history: []
            }
        });
        result = result && !error
        Spielebuch.log('All scenes removed: ' + result);
    },
    deleteGameobjectsOfReference: function (referenceId) {
        if (this.userId === null) {
            Spielebuch.error('403', 'User is not logged in.');
        }
        Spielebuch.log('Removing objects of reference (user or scene): ' + referenceId);

        /**
         * Deletes the stored functions of an object
         */
        Spielebuch.Gameobjects.find({referenceId: referenceId}).forEach(function(doc){
            _.each(doc.events, function(event){
                Spielebuch.StoredFunctions.remove(event.fncId);
            });
            Spielebuch.Gameobjects.remove(doc._id);
        });
    },
});