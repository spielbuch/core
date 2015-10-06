calculateDamage = function (source, target, method, name) {
    var damage = 0;
    if(typeof source.getEffectiveValueByName === 'function') {
        var damage = source.getEffectiveValueByName(method);
    }else{
        damage = source.getValueByName(method);
    }
    if (damage) {
        var hitMultiplier = chance.integer({min: 5, max: 20}) / 10;
        var damageEffect = new Spielebuch.Effect(name, [new Spielebuch.Rule(Spielebuch.Gameplay.hitpoints, '-' + damage)]);
        target.addEffect(damageEffect);

        if (hitMultiplier < 2) {
            Spielebuch.print('damage', source.get('name'), target.get('name'), damage);
        } else {
            Spielebuch.print('criticalDamage', source.get('name'), target.get('name'), damage);
        }
    }
};