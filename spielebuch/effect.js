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

class Effect {
    constructor(name, rules) {
        var self = this;
        self.rules = [];
        self.name = name;
        if (Array.isArray(rules)) {
            _.each(rules, function (rule) {
                self.rules.push({
                    key: rule.key,
                    value: rule.value
                });
            });
        } else {
            self.rules.push({
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
        var self = this;
        return {
            name: self.name,
            rules: self.rules
        }
    }

    getRules(){
        var self = this, result = [];
        _.each(self.rules, function(rule){
            result.push(new Spielebuch.Rule(rule.key, rule.value));
        });
        return result;
    }

    /**
     * Returns effective stats as an object {propertyname: propertyvalue}, by calculating the rules
     * @returns {{}}
     */
    getProperties(){
        var self = this, stats = {};
        _.each(self.rules, function (rule) {
            /**
             * If the stats already have his key (e.g. Hitpoints),
             * Compute with it or override it.
             * If it is not set (when undefined), set it
             */
            if (stats[rule.key] === undefined) {
                stats[rule.key] = rule.value;
            } else {
                /**
                 * If the value is a string, it is a manipulator, it will be computed with the existing value.
                 * If it is a numeric, it will override the value.
                 */
                if (typeof rule.value === 'string' || rule.value instanceof String) {
                    //we parse the values just to be sure. If stats[rule.key] was a manipulator we would do 'string'+'string' = 'stringstring' and this would be bad)
                    stats[rule.key] = parseInt(stats[rule.key]) + parseInt(rule.value);
                } else {
                    //override the last value
                    stats[rule.key] = rule.value;
                }
            }
        });
        return stats;
    }
    /**
     * Returns the effective rules of an effect, by translating getProperties into an array of rules.
     * @returns [Rule]
     */
    getPropertiesArray() {
        var self = this, result = [];
        _.each(self.getProperties(), function(value, key){
            result.push(new Spielebuch.Rule(key, value));
        })
        return result;
    }
}
Spielebuch.Effect = Effect;


class HasEffectsClass extends Spielebuch.Base {
    constructor(userId) {
        super(userId);
    }

    addEffect(effect) {
        var self = this;
        /**
         * We use a serverside method to add effects to run some test to prevent cheating.
         */
        Meteor.call('addEffect', self.getCollection(), self.get('_id'), effect.getJSON());
    }

    getObjectEffect() {
        var self = this, objectEffect = new Effect(self.get('name') + 'Effect', self.getRules());
        return objectEffect;
    }

    getValueByName(name){
        var self = this, properties = self.getProperties();
        console.log(properties);
    }

    /**
     * Returns an array with all the rules for this object.
     * The rules are already calculated.
     * @returns {{}}
     */
    getProperties() {
        var self = this, objectEffect = self.getObjectEffect();
        return objectEffect.getProperties();
    }

    /**
     *
     * @returns {Array}
     */
    getPropertiesArray(){
        var self = this, objectEffect = self.getObjectEffect();
        return objectEffect.getPropertiesArray();
    }

    /**
     * Returns an array with the effects on this object.
     * Each effect is an effect object.
     * @returns {Array}
     */
    getEffects() {
        var self = this, effects = self.get('effects'), result = [];
        _.forEach(effects, function (effect) {
            result.push(new Spielebuch.Effect(effect.name, effect.rules));
        });
        return result;
    }



    getEffectNames(){
        var self = this;
        return _.pluck(self.get('effects'),'name');
    }


    /**
     * Returns an array with all rules of this object.
     * @returns {Array}
     */
    getRules() {
        var self = this, effects = self.getEffects(), result = [];
        _.each(effects, function (effect) {
            result = result.concat(effect.getRules());
        });
        return result;
    }
}
Spielebuch.HasEffects = HasEffectsClass;