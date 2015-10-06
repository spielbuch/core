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

class Player extends Spielebuch.HasEffects {
    constructor(userId, load) {
        super(userId, load);
        if (this.created) {
            this.onCreate();
        } else {
            var doc = Spielebuch.Players.findOne({userId: userId});
            if (doc) {
                this._id = doc._id;
            }
        }
    }


    onCreate() {
        this.set('body', {
                handLeft: {value: false, icon: ''},
                handRight: {value: false, icon: ''},
                armor: {value: false, icon: ''},
                footLeft: {value: false, icon: ''},
                footRight: {value: false, icon: ''},
                head: {value: false, icon: ''}
            }
        )
    }

    addEffect(effect) {
        return super.addEffect(effect);
    }

    getBackpackList() {
        var self = this;
        return Spielebuch.GameObjects.find({referenceId: self.get('userId')}).map((gameObject)=> {
            var equipped = this.equipped(gameObject._id);
            if (equipped === false) {
                gameObject.equipped = 'false'; //we have to use a string, because Blaze has problems with bool.
            } else {
                gameObject.equipped = equipped;
            }
            return gameObject;
        });
    }

    destroy() {
        var self = this;
        Spielebuch.print('destroyedObject', self.get('name'));
        super.destroy();
    }

    afterDestruction(fnc) {
        var self = this, fncId = super.afterDestruction(fnc);
        self.set('afterDestruction', fncId);
    }


    equip(gameObject, bodyPartName) {
        if (!bodyPartName) {
            bodyPartName = gameObject.get('equipmentTarget');
        }
        if (bodyPartName !== gameObject.get('equipmentTarget')) {
            Spielebuch.print('equippingFailed', gameObject.get('name'), bodyPartName);
            return;
        }

        var player = new Spielebuch.Player(this.get('userId'), true);
        var body = player.get('body');
        if (!body) {
            body = player.getFields(this.get('userId')).body;
        }
        if (body[bodyPartName] === undefined) {
            Spielebuch.print('equippingForbidden', gameObject.get('name'));
            return;
        }

        body[bodyPartName].value = gameObject.get('_id');
        player.set('body', body);
    }

    unequip(gameObject) {
        var body = this.get('body');
        var bodyPart = this.equipped(gameObject.get('_id'));
        body[bodyPart].value = false;
        this.set('body', body);
    }

    /**
     * Test if an gameobject is equipped by the player.
     * If yes, this function will return the bodypart as string.
     * If not it will return false.
     * @param gameObjectId
     * @returns {boolean|string}
     */
    equipped(gameObjectId) {
        var result = false;
        _.forEach(this.get('body'), (part, key)=> {
            if (part.value === gameObjectId) {
                result = key;
            }
        });
        return result;
    }

    changeName(name) {
        check(name, String);
        this.set('name',name);
    }

    /**
     * Creates an damage effect with the stats of the player.
     */
    attack(target, attack, name) {
        if(Meteor.isClient) {
            if (!name) {
                name = Spielebuch.Gameplay.hitpoints;
            }
            if(!attack){
                attack = Spielebuch.Gameplay.damage;
            }
            calculateDamage(this, target, attack, name); //attack target
            calculateDamage(target, this, attack, name); //target fights back
        }
    }

    getFields(userId) {
        return {
            'name': {
                type: String,
                default: chance.name()
            },
            'userId': {
                type: String,
                default: userId
            },
            'effects': {
                type: Array,
                default: []
            },
            'afterDestruction': {
                type: String,
                default: ''
            },
            'backpack': {
                type: Array,
                default: []
            },
            'body': {
                type: Object,
                default: {}
            }
        };
    }

    getCollection() {
        return 'Players';
    }
}
Spielebuch.Player = Player;
Spielebuch.Players = new Mongo.Collection('players');