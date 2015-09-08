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

class Story extends Spielebuch.Base {
    constructor() {
        super();
        var self = this;
        if (self.created) {
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

    currentSceneId() {
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
            return self.get('scenes').length - 1;
        }
    }

    /**
     * Starts a story with the first scene, if sceneInex is not set
     * @param sceneInex: if it is set, the scene with the index of sceneIndex in Story.scenes will be the starting scene
     */
    start(sceneIndex) {
        var playingSceneId = false, self = this;
        if (sceneIndex) {
            playingSceneId = self.get('scenes')[sceneIndex];
        } else {
            playingSceneId = self.get('scenes')[0];
        }
        if (!playingSceneId) {
            Spielebuch.error('500', 'This scene does not exist.');
        } else {
            Spielebuch.log('This story (' + self._id + ') starts with scene: ' + playingSceneId + ').');
            self.push('history', playingSceneId);
        }
    }

    startScene(sceneId) {
        var scene = new Spielebuch.Scene();
        scene.load(sceneId);
        scene.executeOnStart();
    }

    next(playingSceneIndex) {
        var self = this, sceneId;
        if (!playingSceneIndex) {
            Spielebuch.error('500', 'Forgot to define the index of the next scene');
        }
        sceneId = self.get('scenes')[playingSceneIndex];
        if (sceneId) {                           //test if this scene exists
            self.push('history', sceneId);      //if it exists it is pushed into the history. This will update the view via the observer.
            self.startScene(sceneId);
        } else {
            Spielebuch.error('500', 'The scene with index ' + playingSceneIndex + ' does not exist.');
        }

    }

    /**
     * The story jumps back to the last scene that was played before the current scene
     */
    before() {
        var self = this, history = self.get('history'), sceneId;
        if (history.length >= 2) {                    //the history should contain at least two scenes to get the last.
            sceneId = history[history.length - 2];  //this will give us the item before the last item.
            self.next(sceneId);                     //simply starting the scene by calling Story.next()
        }

    }


}

Spielebuch.Story = Story;
Spielebuch.Stories = new Mongo.Collection('stories');