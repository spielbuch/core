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

class GameObject extends Spielbuch.HasEffects {
    constructor(objectName, objectKey, referenceId, userId, load) {
        super(userId, load);
        if (this.created) {
            this.onCreate(objectName, objectKey, referenceId, userId);
        }
    }

    onCreate(objectName, objectKey, referenceId, userId) {
        Spielbuch.log('New GameObject was created.');
        this.set('name', objectName);
        this.set('key', objectKey);
        this.set('referenceId', referenceId);
        this.set('userId', userId);

        /**
         * Set default events
         */
        var defaultEvents = Spielbuch.getDefaultEvents(userId);
        if (defaultEvents) {
            _.each(defaultEvents, function (event) {
                if (event) {
                    this.push('events', event);
                }
            });
        }
    }

    setEvent(name, fnc, icon) {
        if (Meteor.isServer) {
            var fncId = Spielbuch.StoredFunction.save(fnc, this.get('userId'));
            if (fncId) {
                this.push('events', {
                    name: name,
                    fncId: fncId,
                    icon: icon
                });
            }
        } else {
            Spielbuch.error(500, 'The client is not allowed to set an event, for it would be madness!');
        }
    }

    getEvents() {
        return this.get('events');
    }

    /**
     * Implements the addEffect method of Spielbuch.HasEffects
     * @returns {*}
     */
    addEffect(effect) {
        return super.addEffect(effect);
    }

    /**
     * Gameobjct is taken by a player or anything else. It is removed from the scene (if it is in one),
     * then the referenceId is updated to the new owner of the object.
     * @param referenceId: The _id of the entity (player, npc etc.) that took the item.
     * Will be the new referenceId of the GameObject
     */
    take() {
        this.removeFromScene();
        this.set('referenceId', this.get('userId'));
    }

    drop(targetSceneId) {
        if (!targetSceneId) {
            var story = new Spielbuch.Story(this.get('userId'), true);
            targetSceneId = story.currentSceneId();
        }
        Meteor.call('dropToScene', this.get('_id'), targetSceneId);
    }

    /**
     * GameObject is removed from the scene (if it is in a scene) and then removed completely.
     */
    destroy() {
        this.removeFromScene();
        Spielbuch.print('destroyedObject', this.get('name'));
        super.destroy();
    }

    afterDestruction(fnc) {
        var fncId = super.afterDestruction(fnc);
        this.set('afterDestruction', fncId);
    }

    removeFromScene() {
        /**
         * Trying to remove it from scene
         */
        if (this.get('referenceId') !== this.get('userId')) {
            var scene = new Spielbuch.Scene(this.get('userId'), '', true);
            scene.load(this.get('referenceId'));
            if (scene) {
                scene.removeGameObject(this.get('_id'));
            }
        }
    }

    setEquipRules(bodyPart, rules) {
        if (Meteor.isServer) {
            check(bodyPart, String);
            this.set('equipmentTarget', bodyPart);
            if (rules) {
                var equipmentRules = {};
                if (Array.isArray(rules.allow)) {
                    equipmentRules.allow = rules.allow;
                }
                if (Array.isArray(rules.deny)) {
                    equipmentRules.allow = rules.deny;
                }
                this.set('equipmentRules', equipmentRules);
            }
        } else {
            Spielbuch.error(403, 'You can set equipment rules only on server-side.')
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
            },
            equipmentTarget: {
                type: String,
                default: ''
            },
            equipmentRules: {
                type: Object,
                default: {
                    allow: [],
                    deny: []
                }
            }
        };
    }

    getCollection() {
        return 'GameObjects';
    }
}
Spielbuch.GameObject = GameObject;
Spielbuch.GameObjects = new Mongo.Collection('gameObjects');