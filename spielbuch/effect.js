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

class Effect {
    constructor(name, rules) {
        this.rules = [];
        this.name = name;
        if (Array.isArray(rules)) {
            _.each(rules, (rule)=>{
                this.rules.push({
                    key: rule.key,
                    value: rule.value
                });
            });
        } else {
            this.rules.push({
                key: rules.key,
                value: rules.value
            });
        }


    }


    /**
     * Returns the properties as JSON
     * @returns {{name: *, rules: Array}}
     */
    getJSON() {
        return {
            name: this.name,
            rules: this.rules
        }
    }

    getRules() {
        var result = [];
        _.each(this.rules, function (rule) {
            result.push(new Spielbuch.Rule(rule.key, rule.value));
        });
        return result;
    }

    /**
     * Returns effective stats as an object {propertyname: propertyvalue}, by calculating the rules
     * @returns {{}}
     */
    getProperties() {
        return Spielbuch.calculator.calculatePropertiesFromRules(this.getRules());
    }

    /**
     * Returns the effective rules of an effect, by translating getProperties into an array of rules.
     * @returns [Rule]
     */
    getPropertiesArray() {
        var result = [];
        _.each(this.getProperties(), function (value, key) {
            result.push(new Spielbuch.Rule(key, value));
        });
        return result;
    }
}
Spielbuch.Effect = Effect;


class HasEffectsClass extends Spielbuch.Base {
    constructor(userId, load) {
        super(userId, load);
    }

    addEffect(effect) {
        /**
         * We use a serverside method to add effects to run some test to prevent cheating.
         */
        if (Meteor.isServer) {
            Meteor.call('addEffect', this.getCollection(), this.get('_id'), effect.getJSON());
            if (this.getValueByName(Spielbuch.Gameplay.hitpoints) < 0) {
                this.destroy();
            }
        }
        if (Meteor.isClient) {
            var gameObject = this;
            Meteor.call('addEffect', this.getCollection(), this.get('_id'), effect.getJSON(), function(err){
                if(err){
                    Spielbuch.error(500,err);
                }
                if (gameObject.getValueByName(Spielbuch.Gameplay.hitpoints) < 0) {
                    gameObject.destroy();
                }
            });
        }
    }

    getObjectEffect() {
        return new Effect(this.get('name') + 'Effect', this.getRules());
    }

    getValueByName(name) {
        var properties = this.getProperties();
        if (!properties[name]) {
            return 0;
        }
        return properties[name];
    }

    /**
     * Returns an array with all the rules for this object.
     * The rules are already calculated (this means no doubles).
     * @returns {{}}
     */
    getProperties() {
        var objectEffect = this.getObjectEffect();
        return objectEffect.getProperties();
    }

    /**
     *
     * @returns {Array}
     */
    getPropertiesArray() {
        var objectEffect = this.getObjectEffect();
        return objectEffect.getPropertiesArray();
    }

    /**
     * Returns an array with the effects on this object.
     * Each effect is an effect object.
     * @returns {Array}
     */
    getEffects() {
        var effects = this.get('effects'), result = [];
        _.forEach(effects, function (effect) {
            result.push(new Spielbuch.Effect(effect.name, effect.rules));
        });
        return result;
    }


    getEffectNames() {
        return _.pluck(this.get('effects'), 'name');
    }


    /**
     * Returns an array with all rules of this object.
     * @returns {Array}
     */
    getRules() {
        var effects = this.getEffects(), result = [];
        _.each(effects, function (effect) {
            result = result.concat(effect.getRules());
        });
        return result;
    }

    destroy() {
        if (Meteor.isClient) {
            Spielbuch.StoredFunction.execute(this.get('afterDestruction'), this.get('_id'));
        }
        Spielbuch.GameObjects.remove(this.get('_id'));
    }

    afterDestruction(fnc) {
        if (Meteor.isServer) {
            var fncId = Spielbuch.StoredFunction.save(fnc, this.get('userId'), this.get('_id'));
            if (fncId) {
                return fncId;
            } else {
                Spielbuch.error(500, 'Could not store afterDestruction event for ' + this.get('_id') + '!');
            }
        } else {
            Spielbuch.error(500, 'The client is not allowed to set an event, for it would be madness!');
        }
    }

}
Spielbuch.HasEffects = HasEffectsClass;