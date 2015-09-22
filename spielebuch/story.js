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
    constructor(userId,load) {
        super(userId,load);
        var self = this;
        if (self.created) {
            self.onCreate();
        } else {
            self.load(userId);
        }
    }

    onCreate() {
    }

    /**
     * This event is added to each gameobject in this story
     */
    addDefaultEvent(name, fnc, icon) {
        var self = this;
        if (Meteor.isClient) {
            Spielebuch.error(403, 'You cannot add a defaultEvent to a story from the client.');
        }
        if (Meteor.isServer) {
            var fncId = Spielebuch.StoredFunction.save(fnc, self.get('userId'));
            if (fncId) {
                self.push('defaultEvents', {
                    name: name,
                    fncId: fncId,
                    icon: icon
                });
            }

        }
    }


    /**
     * Overwrites Base load to set _id by fetching the story by the userId
     * @param userId
     * @returns {boolean}: Feedback if Id was set.
     */
    load(userId) {
        var self = this;
        var cursor = Spielebuch[self.getCollection()].find({userId: userId}, {_id: 1, userId: 1, limit: 1});
        if (cursor.count() === 0) {
            Spielebuch.error(404, 'Story for  user ' + userId + ' was not found in ' + self.getCollection() + '.');
            return false;
        }
        self._id = cursor.fetch()[0]._id;
        return true;
    }

    getFields(userId) {
        return {
            'userId': {
                type: String,
                default: userId
            },
            'scenes': {
                type: Array,
                default: []
            },
            'history': {
                type: Array,
                default: []
            },
            'defaultEvents': {
                type: Array,
                default: []
            },
            eventVariables: {
                type: Object,
                default: {}
            }
        };
    }

    getCollection() {
        return 'Stories';
    }

    createPlayer() {
        var self = this;
        if (Meteor.isClient) {
            Spielebuch.error(403, 'You cannot add a user to a story from the client.');
        }
        if (Meteor.isServer) {
            var userId = self.get('userId');
            Spielebuch.log('Creating player for user ' + userId + '.');
            var player = new Spielebuch.Player(userId);
            return player;
        }
    }

    currentSceneId() {
        if (Meteor.isClient) {
            var self = this;
            return self.last('history');
        }
    }

    addScene() {
        if (Meteor.isServer) {
            var self = this, scene = new Spielebuch.Scene(self.get('userId'), self.get('_id'));
            self.push('scenes', scene.get('_id'));
            scene.index = self.get('scenes').length - 1;
            return scene;
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

    /**
     * Variables in this object will be available in stored functions.
     */
    publish(key, value) {
        var self = this;
        if (Meteor.isServer) {
            var eventVariables = self.get('eventVariables');
            eventVariables[key] = value;
            self.set('eventVariables', eventVariables);
        }
    }


}

Spielebuch.Story = Story;
Spielebuch.Stories = new Mongo.Collection('stories');