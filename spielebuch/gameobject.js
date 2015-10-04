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

class Gameobject extends Spielebuch.HasEffects {
    constructor(objectName, objectKey, referenceId, userId, load) {
        super(userId);
        var self = this;
        if (self.created) {
            self.onCreate(objectName, objectKey, referenceId, userId);
        }
    }

    onCreate(objectName, objectKey, referenceId, userId) {
        var self = this;
        Spielebuch.log('New Gameobject was created.');
        self.set('name', objectName);
        self.set('key', objectKey);
        self.set('referenceId', referenceId);
        self.set('userId', userId);

        /**
         * Set default events
         */
        var defaultEvents = Spielebuch.getDefaultEvents(userId);
        if (defaultEvents) {
            _.each(defaultEvents, function (event) {
                if (event) {
                    self.push('events', event);
                }
            });
        }
    }

    setEvent(name, fnc, icon) {
        var self = this;
        if (Meteor.isServer) {
            var fncId = Spielebuch.StoredFunction.save(fnc, self.get('userId'));
            if (fncId) {
                self.push('events', {
                    name: name,
                    fncId: fncId,
                    icon: icon
                });
            }
        } else {
            Spielebuch.error(500, 'The client is not allowed to set an event, for it would be madness!');
        }
    }

    getEvents() {
        var self = this;
        return self.get('events');
    }

    /**
     * Implements the addEffect method of Spielebuch.HasEffects
     * @returns {*}
     */
    addEffect(effect) {
        return super.addEffect(effect);
    }

    /**
     * Gameobjct is taken by a player or anything else. It is removed from the scene (if it is in one),
     * then the referenceId is updated to the new owner of the object.
     * @param referenceId: The _id of the entity (player, npc etc.) that took the item.
     * Will be the new referenceId of the Gameobject
     */
    take() {
        var self = this;
        self.removeFromScene();
        self.set('referenceId', self.get('userId'));
    }

    /**
     * Gameobject is removed from the scene (if it is in a scene) and then removed completely.
     */
    destroy() {
        this.removeFromScene();
        Spielebuch.print('destroyedObject', this.get('name'));
        super.destroy();
    }

    afterDestruction(fnc) {
        var self = this, fncId = super.afterDestruction(fnc);
        self.set('afterDestruction', fncId);
    }

    removeFromScene() {
        /**
         * Trying to remove it from scene
         */
        var scene = new Spielebuch.Scene();
        scene.load(this.get('referenceId'));
        console.log(scene);
        if (scene) {
            scene.removeGameobject(this.get('_id'));
        }
    }


    getFields(userId) {
        return {
            'name': {
                type: String,
                default: 'Unnamed Object'
            },
            'key': {
                type: String,
                default: 'default'
            },
            'referenceId': {
                type: String,
                default: 'global'
            },
            'userId': {
                type: String,
                default: userId
            },
            'effects': {
                type: Array,
                default: []
            },
            'events': {
                type: Array,
                default: []
            },
            'afterDestruction': {
                type: String,
                default: ''
            }
        };
    }

    getCollection() {
        return 'Gameobjects';
    }
}
Spielebuch.Gameobject = Gameobject;
Spielebuch.Gameobjects = new Mongo.Collection('gameobjects');