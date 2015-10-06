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
    constructor(userId, load) {
        super(userId, load);
        if (this.created) {
            this.onCreate();
        } else {
            this.load(userId);
        }
    }

    onCreate() {
    }

    /**
     * This event is added to each gameObject in this story
     */
    addDefaultEvent(name, fnc, icon) {
        if (Meteor.isClient) {
            Spielebuch.error(403, 'You cannot add a defaultEvent to a story from the client.');
        }
        if (Meteor.isServer) {
            var fncId = Spielebuch.StoredFunction.save(fnc, this.get('userId'));
            if (fncId) {
                this.push('defaultEvents', {
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
        var cursor = Spielebuch[this.getCollection()].find({userId: userId}, {_id: 1, userId: 1, limit: 1});
        if (cursor.count() === 0) {
            Spielebuch.error(404, 'Story for  user ' + userId + ' was not found in ' + this.getCollection() + '.');
            return false;
        }
        this._id = cursor.fetch()[0]._id;
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
        if (Meteor.isClient) {
            Spielebuch.error(403, 'You cannot add a user to a story from the client.');
        }
        if (Meteor.isServer) {
            var userId = this.get('userId');
            Spielebuch.log('Creating player for user ' + userId + '.');
            return new Spielebuch.Player(userId);
        }
    }

    getPlayer() {
        var player = new Spielebuch.Player(this.get('userId'), true);
        return player;
    }

    currentSceneId() {
        return this.last('history');
    }

    addScene() {
        if (Meteor.isServer) {
            var scene = new Spielebuch.Scene(this.get('userId'), this.get('_id'));
            this.push('scenes', scene.get('_id'));
            scene.index = this.get('scenes').length - 1;
            return scene;
        }
    }

    /**
     * Starts a story with the first scene, if sceneInex is not set
     * @param sceneIndex: if it is set, the scene with the index of sceneIndex in Story.scenes will be the starting scene
     */
    start(sceneIndex) {
        var playingSceneId = false;
        if (sceneIndex) {
            playingSceneId = this.get('scenes')[sceneIndex];
        } else {
            playingSceneId = this.get('scenes')[0];
        }
        if (!playingSceneId) {
            Spielebuch.error('500', 'This scene does not exist.');
        } else {
            Spielebuch.log('This story (' + this._id + ') starts with scene: ' + playingSceneId + ').');
            this.push('history', playingSceneId);
        }
    }

    startScene(sceneId) {
        var scene = new Spielebuch.Scene();
        scene.load(sceneId);
        scene.executeOnStart();
    }

    next(playingSceneIndex) {
        if (!playingSceneIndex) {
            Spielebuch.error('500', 'Forgot to define the index of the next scene');
        }
        var sceneId = this.get('scenes')[playingSceneIndex];
        if (sceneId) {                           //test if this scene exists
            this.push('history', sceneId);      //if it exists it is pushed into the history. This will update the view via the observer.
            this.startScene(sceneId);
        } else {
            Spielebuch.error('500', 'The scene with index ' + playingSceneIndex + ' does not exist.');
        }

    }

    /**
     * The story jumps back to the last scene that was played before the current scene
     */
    before() {
        var history = this.get('history'), sceneId;
        if (history.length >= 2) {                    //the history should contain at least two scenes to get the last.
            sceneId = history[history.length - 2];  //this will give us the item before the last item.
            this.next(sceneId);                     //simply starting the scene by calling Story.next()
        }

    }

    /**
     * Variables in this object will be available in stored functions.
     */
    publish(key, value) {
        if (Meteor.isServer) {
            var eventVariables = this.get('eventVariables');
            eventVariables[key] = value;
            this.set('eventVariables', eventVariables);
        }
    }


}

Spielebuch.Story = Story;
Spielebuch.Stories = new Mongo.Collection('stories');