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

class Scene extends Spielebuch.Base {
    constructor() {
        super();
        var self = this;
        if (self.created) {
            self.onCreate();
        }
    }

    getFields() {
        return {
            'storyId': {
                type: String,
                default: 'global'
            },
            'userId': {
                type: String,
                default: 'global'
            },
            'text': {
                type: Array,
                default: []
            },
            'effects': {
                type: Array,
                default: []
            },
            onFirstVisit: {
                type: String,
                default: ''
            },
            onVisit: {
                type: String,
                default: ''
            },
            visited: {
                type: Boolean,
                default: false
            }
        };
    }

    getCollection() {
        return 'Scenes';
    }

    removeGameobject(_id) {
        var self = this, text = self.get('text');
        _.each(text, function (sentence, key) {
            if (typeof sentence === 'string') {
                if (sentence.indexOf(_id)!==-1) {
                    return text.splice(key, 1);
                }
            }
        });
        self.set('text', text);
    }


    onCreate() {
    }

    /**
     * Creates gameobjets from a text with markup.
     * Changes the markuped text, that the objectnames are replaced by the _ids of the created objects.
     * @param text: Text with markdown, that will be searched for gameobjects
     * @param referenceId: The _id of the place, the object is in (_id of scene or user)
     * @returns {{gameobjects: Array, text: String}}
     */
    addText(text) {
        if (Meteor.isServer) {
            var self = this, re = /[^[\]]+(?=])/, objects = re.exec(text), objectname, gameobject;
            if (objects !== null) {
                objectname = objects[0];
                gameobject = new Spielebuch.Gameobject(objectname, self._id, self.get('userId'), self.get('_id'));
                text = text.replace(new RegExp('\\[' + objectname + '\\]', 'g'), '[' + gameobject.get('_id') + ']');
            }
            self.push('text', text);
            Spielebuch.log('Added text to scene ' + self._id + '.');
            return gameobject;
        }
    }

    onFirstVisit(fnc) {
        if (Meteor.isServer) {
            var self = this, fncId = Spielebuch.StoredFunction.save(fnc, self.get('userId'), self.get('_id'));
            self.set('onFirstVisit', fncId);
        }
    }

    onVisit(fnc) {
        if (Meteor.isServer) {
            var self = this, fncId = Spielebuch.StoredFunction.save(fnc, self.get('userId'));
            self.set('onVisit', fncId);
        }
    }

    executeOnStart() {
        if (Meteor.isClient) {
            var self = this, visited = self.get('visited');
            if (visited) {
                Spielebuch.StoredFunction.execute(self.get('onVisit'));
            }
            else {
                Spielebuch.StoredFunction.execute(self.get('onFirstVisit'));
                self.set('visited', true);
            }
        }
    }
}
;

Spielebuch.Scene = Scene;
Spielebuch.Scenes = new Mongo.Collection('scenes');

