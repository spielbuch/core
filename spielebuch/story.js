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

class Story extends Base {
    constructor() {
        super();
        var self = this;
        if(self.created){
            self.onCreate();
        }
    }

    getFields() {
        return {
            'userId': {
                type: String,
                default: 'global'
            },
            'scenes': {
                type: Array,
                default: []
            },
            'history': {
                type: Array,
                default: []
            }
        };
    }

    getCollection() {
        return 'Stories';
    }

    onCreate() {

    }


    addPlayer(userId) {
        var self = this;
        if (Meteor.isClient) {
            Spielebuch.error(403, 'You cannot add a user to a story from the client.');
        }
        if (Meteor.isServer) {
            self.set('userId', userId);
            var update = Meteor.users.update(userId, {
                $set: {
                    storyId: self._id
                }
            });
            Spielebuch.log('Userdoc update worked: ' + !!update);

            update = Spielebuch.Scenes.update({storyId: self._id}, {
                $set: {userId: userId}
            });
            Spielebuch.Scenes.find({storyId: self._id}).forEach(function (doc) {
                Spielebuch.Gameobjects.update({referenceId: doc._id}, {
                    $set: {userId: userId}
                })
            });
            Spielebuch.log('Scenedocs update worked: ' + !!update);

        }
    }

    playingSceneId() {
        if (Meteor.isClient) {
            var self = this;
            return self.last('history');
        }
    }

    addScene(scene) {
        if (Meteor.isServer) {
            var self = this;
            scene.set('storyId', self._id);
            scene.set('userId', self.get('userId'));
            self.push('scenes', scene.get('_id'));
        }
    }

    start(sceneId) {
        var playingScene = false, self = this;
        if (sceneId) {
            playingScene = self.get('scenes')[sceneId];
        } else {
            playingScene = self.get('scenes')[0];
        }
        if (!playingScene) {
            Spielebuch.error('500', 'This scene does not exist.');
        }
        Spielebuch.log('This story (' + self._id + ') starts with scene: ' + playingScene + ').');
        self.push('history', playingScene);
    }

    removeAllScenes() {
        var self = this, scenes = self.scenes, storyId = self._id;
        Spielebuch.log('Scenes of story (' + storyId + ') to clean up: ');
        Meteor.call('deleteScenesOfStory', storyId);
        //then we remove the scene from the object.
        self.set('history', []);
        self.set('scenes', []);
    }


}

Spielebuch.Story = Story;
Spielebuch.Stories = new Mongo.Collection('stories');