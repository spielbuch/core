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

class Player extends Spielbuch.HasEffects {
    constructor(userId, load) {
        super(userId, load);
        if (this.created) {
            this.onCreate();
        } else {
            var doc = Spielbuch.Players.findOne({userId: userId});
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
        return Spielbuch.GameObjects.find({referenceId: this.get('userId')}).map( gameObject => {
            let equipped = this.equipped(gameObject._id);
            if (equipped === false) {
                gameObject.equipped = 'false'; //we have to use a string, because Blaze has problems with bool.
            } else {
                gameObject.equipped = equipped;
            }
            return gameObject;
        });
    }

    destroy() {
        Spielbuch.print('destroyedObject', this.get('name'));
        super.destroy();
    }

    afterDestruction(fnc) {
        var fncId = super.afterDestruction(fnc);
        this.set('afterDestruction', fncId);
    }


    equip(gameObject, bodyPartName) {

        /**
         * Test if the object has been taken by the player.
         */
        if(gameObject.get('referenceId')!==this.get('userId')){
            Spielbuch.error(500,`The player has to take the ${gameObject.get('name')} before it can be equipped.`);
            return false;
        }

        if (!bodyPartName) {
            bodyPartName = gameObject.get('equipmentTarget');
        }
        if (bodyPartName !== gameObject.get('equipmentTarget')) {
            Spielbuch.print('equippingFailed', gameObject.get('name'), bodyPartName);
            return false;
        }

        var body = this.get('body');
        if (!body) {
            body = this.getFields(this.get('userId')).body;
        }
        if (body[bodyPartName] === undefined) {
            Spielbuch.print('equippingForbidden', gameObject.get('name'));
            return false;
        }

        body[bodyPartName].value = gameObject.get('_id');
        this.set('body', body);
        return true;
    }

    unequip(gameObject) {
        var body = this.get('body');
        var bodyPart = this.equipped(gameObject.get('_id'));
        if (bodyPart) {
            body[bodyPart].value = false;
            this.set('body', body);
        }
    }

    /**
     * Test if an gameobject is equipped by the player.
     * If yes, this function will return the bodypart as string.
     * If not it will return false.
     * @param gameObjectId
     * @returns {boolean|string}
     */
    equipped(gameObjectId) {
        var result = false, change = false, body = this.get('body');
        _.forEach(body, (part, key)=> {
            if (part.value === gameObjectId) {
                /**
                 * check with the database
                 */
                var doc = Spielbuch.GameObjects.findOne(gameObjectId);
                if (doc && doc.referenceId === this.get('userId')) {
                    result = key;
                } else {
                    part.value = false;
                    change = true;
                }
            }
        });
        if (change) {
            this.set('body', body);
        }
        return result;
    }


    /**
     * Returns an array with all the equipped objects.
     * @returns {Array}
     */
    getEquippedObjects() {
        var result = [], index = 0;
        _.forEach(this.get('body'), (bodyPart)=> {
            if (bodyPart.value) {
                result[index] = new Spielbuch.GameObject('', '', '', this.get('userId'), true);
                result[index].load(bodyPart.value);
                index++;
            }
        });
        return result;
    }

    /**
     * Returns all the rules of the gameObjects the player is equipped.
     * @returns {Array}
     */
    getEquippedRules() {
        var rules = [];
        _.forEach(this.getEquippedObjects(), (gameObject)=> {
            rules = rules.concat(gameObject.getRules());
        });
        return rules;
    }

    /**
     * Returns an effect object with the equipped objects rules
     * @returns {Effect}
     */
    createEquippedEffect() {
        return new Spielbuch.Effect('Equipped', this.getEquippedRules());
    }

    /**
     * Returns numeric value of a property of the player's equipment
     * @param propertyName
     * @returns Number
     */
    getEquippedValueByName(propertyName) {
        var properties = this.getEquippedProperties();
        if(!properties[propertyName]){
            return 0;
        }
        return properties[propertyName];
    }

    /**
     * Returns all the properies of the player's equipment as object
     * @returns {key: String, value: Number}
     */
    getEquippedProperties() {
        return this.createEquippedEffect().getProperties();
    }

    getName() {
        return this.get('name');
    }

    setName(name) {
        check(name, Match.Where(function (str) {
            check(str, String);
            var regexp = /^[A-Za-z\d\s]+$/i;
            return regexp.test(str);
        }));
        this.set('name', name);
    }

    /**
     * Creates an damage effect with the stats of the player.
     */
    attack(target, attack, name) {
        if (Meteor.isClient) {
            if (!name) {
                name = Spielbuch.Gameplay.hitpoints;
            }
            if (!attack) {
                attack = Spielbuch.Gameplay.damage;
            }
            Spielbuch.calculator.calculateDamage(this, target, attack, name); //attack target
            Spielbuch.calculator.calculateDamage(target, this, attack, name); //target fights back
        }
    }

    /**
     * Adds the value of a property of the equipment
     * to the value of a property of the player
     * and returns it as number.
     * @param name
     * @returns Number
     */
    getEffectiveValueByName(name) {
        var value = super.getValueByName(name),
            valueEquipment = this.getEquippedValueByName(name);
        return parseInt(value) + parseInt(valueEquipment);
    }

    /**
     *
     * @param userId
     * @returns {{name: {type: String, default: *}, userId: {type: String, default: *}, effects: {type: Array, default: Array}, afterDestruction: {type: String, default: string}, backpack: {type: Array, default: Array}, body: {type: Object, default: {}}}}
     */
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
Spielbuch.Player = Player;
Spielbuch.Players = new Mongo.Collection('players');