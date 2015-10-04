calculateDamage = function(source, target, method){
    var damage = source.getValueByName(method);
    if(damage) {
        var hitMultiplier = chance.integer({min: 5, max: 20}) / 10;
        target.addEffect(new Spielebuch.Effect(name, [new Spielebuch.Rule(Spielebuch.Gameplay.hitpoints, '-' + damage)]));
        if (hitMultiplier < 2) {
            Spielebuch.print('damage', source.get('name'), target.get('name'), damage);
        } else {
            Spielebuch.print('criticalDamage', source.get('name'), target.get('name'), damage);
        }
    }
};