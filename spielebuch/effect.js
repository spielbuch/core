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

    getJSON() {
        return {
            name: self.name,
            rules: self.rules
        }
    }

    /**
     * Returns the effective values of an effect, by calculating the rules.
     * @returns {Array}
     */
    getValues() {
        var stats = {}, result = [];
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
        result = _.pairs(stats);
        return result;
    }
}
Spielebuch.Effect = Effect;


class HasEffectsClass extends Base {
    constructor() {
        super();
    }

    addEffect(effect) {
        self.push('effects', effect.getJSON());
    }

    getObjectEffect() {
        var objectEffect = new Effect(self.name + 'Effect', self.getAllRules());
        return objectEffect;
    }

    /**
     * Returns an array with all the rules for this object.
     * The rules are already calculated.
     * @returns {Array}
     */
    getStats() {
        var objectEffect = self.getObjectEffect();
        return objectEffect.getValues();
    }

    /**
     * Returns an array with the effects on this object.
     * Each effect is an effect object.
     * @returns {Array}
     */
    getEffects() {
        var effects = self.get('effects'), result = [];
        _.forEach(effects, function (effect) {
            result.push(new Spielebuch.Effect(effect.name, effect.rules));
        });
        return result;
    }


    /**
     * Returns an array with all rules of this object.
     * @returns {Array}
     */
    getAllRules() {
        var effects = self.getEffects(), result = [];
        _.each(effects, function (effect) {
            result = result.concat(effect.getValues());
        });
        return result;
    }

}
HasEffects = HasEffectsClass;