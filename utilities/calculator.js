Spielebuch.calculator =  {};
Spielebuch.calculator.calculateDamage = function (source, target, method, name) {
    var damage = 0;
    if (typeof source.getEffectiveValueByName === 'function') {
        damage = source.getEffectiveValueByName(method);
    } else {
        damage = source.getValueByName(method);
    }
    if (damage) {
        var hitMultiplier = chance.integer({min: 5, max: 20}) / 10;
        damage *= hitMultiplier;
        damage -= target.getValueByName(Spielebuch.Gameplay.defense);
        var damageEffect = new Spielebuch.Effect(name, [new Spielebuch.Rule(Spielebuch.Gameplay.hitpoints, '-' + damage)]);
        target.addEffect(damageEffect);

        if (hitMultiplier < 2) {
            Spielebuch.print('damage', source.get('name'), target.get('name'), damage);
        } else {
            Spielebuch.print('criticalDamage', source.get('name'), target.get('name'), damage);
        }
    }
};


Spielebuch.calculator.calculatePropertiesFromRules = function (rules) {
    var properties = {};
    _.forEach(rules, function (rule) {
        /**
         * If the stats already have his key (e.g. Hitpoints),
         * Compute with it or override it.
         * If it is not set (when undefined), set it
         */
        if (!properties[rule.key]) {
            properties[rule.key] = rule.value;
        } else {
            /**
             * If the value is a string, it is a manipulator, it will be computed with the existing value.
             * If it is a numeric, it will override the value.
             */
            if (typeof rule.value === 'string' || rule.value instanceof String) {
                //we parse the values just to be sure. If stats[rule.key] was a manipulator we would do 'string'+'string' = 'stringstring' and this would be bad)
                var tmp = parseInt(properties[rule.key]) + parseInt(rule.value);
                if (typeof properties[rule.key] === 'string' || properties[rule.key] instanceof String) {
                    if (tmp >= 0) {
                        properties[rule.key] = '+' + tmp.toString();
                    } else {
                        properties[rule.key] = tmp.toString();
                    }
                } else {
                    properties[rule.key] = tmp;
                }
            } else {
                //override the last value
                properties[rule.key] = rule.value;
            }
        }
    });
    return properties;
};