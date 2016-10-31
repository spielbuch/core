/**
 * Created by Daniel Budick on 01 Okt 2015.
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

Spielbuch.Settings.debug = false;

function clear(userId) {
    Spielbuch.Stories.remove({
        'userId': userId
    });
    Spielbuch.Scenes.remove({
        'userId': userId
    });
    Spielbuch.GameObjects.remove({
        'userId': userId
    });
    Spielbuch.StoredFunctions.remove({
        'userId': userId
    });
    Spielbuch.Players.remove({
        'userId': userId
    });
}
var swordDamage = new Spielbuch.Rule(Spielbuch.Gameplay.damage, '+60'),
    iron = new Spielbuch.Rule(Spielbuch.Gameplay.hitpoints, 260),
    humanHealth = new Spielbuch.Rule(Spielbuch.Gameplay.hitpoints, 80),
    humanFistDamage = new Spielbuch.Rule(Spielbuch.Gameplay.damage, 20),
    shieldDefense = new Spielbuch.Rule(Spielbuch.Gameplay.defense, '+20'),
    wooden = new Spielbuch.Rule(Spielbuch.Gameplay.defense, 200);
var userId = '1234asdf';

Tinytest.add('Test Spielbuch constructors', function (test) {
    var story = new Spielbuch.Story(userId);
    test.instanceOf(story, Spielbuch.Story);


    test.isTrue(function () {
        return story.created && story.get('userId') === userId;
    }, 'Story does not work.');

    var player = story.createPlayer();
    test.instanceOf(player, Spielbuch.Player);
    test.isTrue(function () {
        return player.get('userId') === userId;
    }, 'Player does not work.');

    var sceneOne = story.addScene();

    test.instanceOf(sceneOne, Spielbuch.Scene);
    var firstScene = sceneOne.index;
    story.start(firstScene);

    test.isTrue(function () {
        return !!sceneId.get('_id');
    }, 'Adding scenes does not work.');

    test.isTrue(function () {
        var playingSceneId = _.last(story.history);
        return sceneOne.get('_id') === playingSceneId;
    }, 'Story.start() does not work.');

    test.isTrue(function () {
        return sceneOne.get('_id') === story.currentSceneId();
    }, 'Story.currentSceneId() does not work.');


    var tableText = '[Table](wooden_table)';
    var table = sceneOne.addText(tableText);

    test.instanceOf(table, Spielbuch.GameObject);
    test.isTrue(function () {
        return !!table.get('_id');
    }, 'Adding GameObjects via scene.addText() does not work.');
    test.isTrue(function () {
        return sceneOne.get('_id') === table.get('referenceId');
    }, 'Adding text does not work.');
    var text = sceneOne.addText('Text without an object');
    test.equal(text, {},
        'Scene.addText(\'Text without an object\') does not work.');
    var wrongText = sceneOne.addText('Text with wrong [Object]');
    test.equal(wrongText, {},
        'Scene.addText(\'Text with wrong [Object]\') does not work.');

    clear(userId);
});


Tinytest.add('Test Spielbuch calculators', function (test) {
    test.equal(Spielbuch.calculator.calculatePropertiesFromRules([swordDamage, swordDamage, swordDamage]), {"Damage": '+180'},
        'Spielbuch.calculator.calculatePropertiesFromRules() does not work.');
    test.equal(Spielbuch.calculator.calculatePropertiesFromRules([swordDamage, swordDamage, humanFistDamage]), {"Damage": 20},
        'Spielbuch.calculator.calculatePropertiesFromRules() does not work with absolute override.');
    test.equal(Spielbuch.calculator.calculatePropertiesFromRules([humanFistDamage, swordDamage, swordDamage, swordDamage]), {"Damage": 200},
        'Spielbuch.calculator.calculatePropertiesFromRules() does not work with absolute and manipulators mixed.');
});


Tinytest.add('Test Spielbuch Effects', function (test) {
    var story = new Spielbuch.Story(userId);
    var player = story.createPlayer();
    var sceneOne = story.addScene();
    var firstScene = sceneOne.index;
    story.start(firstScene);

    var sword = sceneOne.addText('[Sword](iron_sword)');
    test.isTrue(function () {
        return !!sword.get('_id');
    }, 'Adding GameObjects via scene.addText() does not work.');

    sword.addEffect(new Spielbuch.Effect('iron', [swordDamage, iron]));


    test.equal(sword.getRules(), [swordDamage, iron],
        'GameObject.getRules() does not work.');

    test.instanceOf(sword.getRules()[0], Spielbuch.Rule);

    test.instanceOf(sword.getObjectEffect(), Spielbuch.Effect);

    test.equal(sword.getObjectEffect(), new Spielbuch.Effect('SwordEffect', [swordDamage, iron]),
        'GameObject.getObjectEffect() does not work.');

    test.equal(sword.getValueByName(Spielbuch.Gameplay.damage), '+60',
        'GameObject.getValueByName() does not work.');

    test.equal(sword.getValueByName(Spielbuch.Gameplay.hitpoints), 260,
        'GameObject.getValueByName() does not work.');
    test.equal(sword.getProperties(), {Damage: '+60', Hitpoints: 260},
        'GameObject.getProperties() does not work.');

    test.equal(sword.getPropertiesArray(), [{"key": "Damage", "value": "+60"}, {"key": "Hitpoints", "value": 260}],
        'GameObject.getPropertiesArray() does not work.');

    /**
     * add a second effect just for giggles... no seriously, this test showed me a huge mistake I made.
     * I <3 tinytest!
     */
    sword.addEffect(new Spielbuch.Effect('sharp', [swordDamage]));

    test.equal(sword.getRules(), [swordDamage, iron, swordDamage],
        'GameObject.getRules() does not work correctly when having multiple effects.');

    test.equal(sword.getObjectEffect(), new Spielbuch.Effect('SwordEffect', [swordDamage, iron, swordDamage]),
        'GameObject.getObjectEffect() does not work correctly when having multiple effects.');


    test.instanceOf(sword.getEffects()[0], Spielbuch.Effect);

    test.equal(sword.getEffects(), [{
            "rules": [{"key": "Damage", "value": "+60"}, {"key": "Hitpoints", "value": 260}],
            "name": "iron"
        }, {"rules": [{"key": "Damage", "value": "+60"}], "name": "sharp"}],
        'GameObject.getEffects() does not work.');

    test.equal(sword.getEffectNames(), ["iron", "sharp"],
        'GameObject.getEffectNames() does not work.');

    test.equal(sword.getValueByName(Spielbuch.Gameplay.damage), '+120',
        'GameObject.getValueByName() does not work correctly when having multiple effects.');

    clear(userId);
});


Tinytest.add('Test Spielbuch player I', function (test) {
    var story = new Spielbuch.Story(userId);
    var player = story.createPlayer();
    var sceneOne = story.addScene();
    var firstScene = sceneOne.index;
    var newUserName = 'Foobar';
    story.start(firstScene);


    test.equal(player.getName(), player.get('name'),
        'Player.getName() does not work.');

    test.throws(function () {
        player.setName(1337);
    });

    player.setName('A B');
    test.equal(player.getName(), 'A B',
        'Player.setName() does not work with spaces.');
    player.setName('A Babo69');
    test.equal(player.getName(), 'A Babo69',
        'Player.setName() does not work with spaces and numbers.');


    test.throws(function () {
        player.setName('\'This should fail>');
    });
    test.throws(function () {
        player.setName('<script>alert(\'xss\')</script>');
    });

    player.setName(newUserName);
    test.equal(player.getName(), newUserName,
        'Player.setName() does not work.');

    test.equal(player.get('body'), {
        handLeft: {value: false, icon: ''},
        handRight: {value: false, icon: ''},
        armor: {value: false, icon: ''},
        footLeft: {value: false, icon: ''},
        footRight: {value: false, icon: ''},
        head: {value: false, icon: ''}
    }, 'Default bodyparts were not set for player.');

    player.set('body', {
        handLeft: {value: false, icon: ''},
        handRight: {value: false, icon: ''}
    });

    test.equal(player.get('body'), {
        handLeft: {value: false, icon: ''},
        handRight: {value: false, icon: ''}
    }, 'New bodyparts were not set.');
    player.addEffect(new Spielbuch.Effect('Human', [humanHealth, humanFistDamage]));
    test.equal(player.getRules(), [humanHealth, humanFistDamage],
        'Player.getRules() does not work.');
    test.equal(player.getObjectEffect(), new Spielbuch.Effect(newUserName + 'Effect', [humanHealth, humanFistDamage]),
        'Player.getObjectEffect() does not work.');
    test.equal(player.getValueByName(Spielbuch.Gameplay.damage), 20,
        'Player.getValueByName() does not work.');
    test.equal(player.getValueByName(Spielbuch.Gameplay.hitpoints), 80,
        'Player.getValueByName() does not work.');
    test.equal(player.getProperties(), {Damage: 20, Hitpoints: 80},
        'Player.getProperties() does not work.');
    test.equal(player.getPropertiesArray(), [{"key": "Hitpoints", "value": 80}, {"key": "Damage", "value": 20}],
        'Player.getPropertiesArray() does not work.');


    var sword = sceneOne.addText('[Sword](iron_sword)');
    sword.addEffect(new Spielbuch.Effect('iron', [swordDamage, iron]));

    sword.take();
    test.equal(sword.get('referenceId'), player.get('userId'),
        'GameObject.take() does not work.');


    /**
     * This must fail!
     */
    player.equip(sword);
    test.equal(player.getEquippedObjects(), [],
        'The player is allowed to use the sword, so the array should be empty.');
    test.equal(player.get('body'), {
        handLeft: {value: false, icon: ''},
        handRight: {value: false, icon: ''}
    }, 'The player is allowed to use the sword, so the body should be empty.');
    sword.setEquipRules('handRight');
    player.equip(sword);

    /**
     * From now on the player has a sword in the right hand.
     */
    test.equal(player.getEquippedObjects(), [{created: false, _id: sword.get('_id')}],
        'Player.equip() does work.');
    test.equal(player.get('body'), {
        handLeft: {value: false, icon: ''},
        handRight: {value: sword.get('_id'), icon: ''}
    }, 'The player is allowed to use the sword, so the body should be empty.');

    test.equal(player.equipped(sword.get('_id')), 'handRight',
        'Player.equipped() does not work.');
    player.unequip(sword);
    test.isFalse(player.equipped(sword.get('_id')),
        'Player.unequip() does not work.');
    player.equip(sword);
    test.isFalse(!player.equipped(sword.get('_id')),
        'Player.equip() after Player.unequip() does not work.');

    sword.destroy();
    test.isFalse(player.equipped(sword.get('_id')),
        'GameObject.destroy() does has no influence on Player.equipped().');
});

Tinytest.add('Test Spielbuch player II', function (test) {
    var story = new Spielbuch.Story(userId);
    var player = story.createPlayer();
    player.addEffect(new Spielbuch.Effect('Human', [humanHealth, humanFistDamage]));
    var sceneOne = story.addScene();
    var firstScene = sceneOne.index;
    story.start(firstScene);
    /**
     * create two  swords
     */
    var swordOne = sceneOne.addText('Another [SwordOne](iron_sword)');
    swordOne.addEffect(new Spielbuch.Effect('iron', [swordDamage]));
    swordOne.setEquipRules('handRight');

    var swordTwo = sceneOne.addText('And a third [SwordTwo](iron_sword)');
    swordTwo.addEffect(new Spielbuch.Effect('iron', [swordDamage]));
    swordTwo.setEquipRules('handLeft');
    swordOne.take();
    test.equal(swordOne.get('referenceId'), player.get('userId'),
        'GameObject.take() does not work.');
    player.equip(swordOne);

    test.equal(player.equipped(swordOne.get('_id')), 'handRight',
        'Player.equipped(swordOne) does not work.');
    test.equal(player.getEquippedObjects(), [{created: false, _id: swordOne.get('_id')}],
        'Player.getEquippedObjects() does not work.');

    /**
     * We add a second GameObject for the other hand
     */
    var shield = sceneOne.addText('[Shield](iron_shield)');
    shield.addEffect(new Spielbuch.Effect('iron', [shieldDefense, iron]));
    shield.setEquipRules('handLeft');
    shield.take();
    player.equip(shield);
    test.equal(player.getEquippedObjects(), [
            {created: false, _id: shield.get('_id')},
            {created: false, _id: swordOne.get('_id')}],
        'Player.getEquippedObjects() does not work.');
    shield.drop();
    test.isFalse(player.equipped(shield.get('_id')),
        'Player.drop() does not work.');
    test.equal(player.getEquippedObjects(), [{created: false, _id: swordOne.get('_id')}],
        'Player.drop() does not work.');

    test.throws(function () {
        player.equip(shield);
    });

    shield.take();
    player.equip(shield);
    test.equal(player.equipped(shield.get('_id')), 'handLeft',
        'Equipping after drop and take does work.');
    test.equal(player.getEquippedObjects(), [
            {created: false, _id: shield.get('_id')},
            {created: false, _id: swordOne.get('_id')}],
        'Player.getEquippedObjects() does not work after drop, take and equip.');


    test.equal(player.getEquippedRules(), [
            {"key": "Defense", "value": "+20"},
            {"key": "Hitpoints", "value": 260},
            {"key": "Damage", "value": "+60"}],
        'Player.getEquippedRules() does not work.');

    test.equal(player.createEquippedEffect(), {
            "rules": [
                {"key": "Defense", "value": "+20"},
                {"key": "Hitpoints", "value": 260},
                {"key": "Damage", "value": "+60"}],
            "name": "Equipped"
        },
        'Player.createEquippedEffect() does not work.');

    test.equal(player.getEquippedValueByName(Spielbuch.Gameplay.hitpoints), 260,
        'Player.createEquippedEffect(Spielbuch.Gameplay.hitpoints) does not work.');
    test.equal(player.getEquippedValueByName(Spielbuch.Gameplay.damage), '+60',
        'Player.createEquippedEffect(Spielbuch.Gameplay.damage) does not work.');
    test.equal(player.getEquippedValueByName(Spielbuch.Gameplay.defense), '+20',
        'Player.createEquippedEffect(Spielbuch.Gameplay.defense) does not work.');

    test.equal(player.getEquippedProperties(),
        {"Defense": "+20", "Hitpoints": 260, "Damage": "+60"},
        'Player.getEquippedProperties() does not work.');

    test.equal(player.getEffectiveValueByName(Spielbuch.Gameplay.hitpoints), 340,
        'Player.getEffectiveValueByName(Spielbuch.Gameplay.hitpoints) does not work.');
    test.equal(player.getEffectiveValueByName(Spielbuch.Gameplay.damage), 80,
        'Player.getEffectiveValueByName(Spielbuch.Gameplay.damage) does not work.');
    test.equal(player.getEffectiveValueByName(Spielbuch.Gameplay.defense), 20,
        'Player.getEffectiveValueByName(Spielbuch.Gameplay.defense) does not work.');


    /**
     * Third sword to have to damage manipulators
     */
    swordTwo.take();
    player.equip(swordTwo);

    test.equal(player.equipped(swordTwo.get('_id')), 'handLeft',
        'player.equip(swordThree) did not work.');

    test.equal(player.getEquippedRules(), [
            {"key": "Damage", "value": "+60"},
            {"key": "Damage", "value": "+60"}],
        'Player.getEquippedRules() does not work.');

    test.equal(player.getEffectiveValueByName(Spielbuch.Gameplay.damage), 140,
        'Player.getEffectiveValueByName(Spielbuch.Gameplay.damage) does not work with two manipulators.');



    test.equal(player.getEquippedProperties(), {"Damage":"+120"},
        'Player.getEquippedProperties() does not work with two manipulators.');
    test.equal(player.getEquippedValueByName(Spielbuch.Gameplay.damage), '+120',
        'Player.getEquippedValueByName(Spielbuch.Gameplay.damage) does not work with two manipulators.');

    clear(userId);
});

Tinytest.add('Test Spielbuch fighting', function (test) {
    var story = new Spielbuch.Story(userId);
    var player = story.createPlayer();
    player.set('body', {
        handLeft: {value: false, icon: ''},
        handRight: {value: false, icon: ''}
    });
    player.setName('Test');

    var sceneOne = story.addScene();
    var firstScene = sceneOne.index;
    story.start(firstScene);

    var tableText = '[Table](wooden_table)';
    var table = sceneOne.addText(tableText);
    table.addEffect(new Spielbuch.Effect('wooden', [wooden]));

    var sword = sceneOne.addText('[Sword](iron_sword)');
    test.instanceOf(sword, Spielbuch.GameObject);

    sword.addEffect(new Spielbuch.Effect('iron', [swordDamage]));
    sword.setEquipRules('handRight');
    sword.take();
    player.equip(sword);

    var shield = sceneOne.addText('[Shield](iron_shield)');
    test.instanceOf(shield, Spielbuch.GameObject);
    shield.addEffect(new Spielbuch.Effect('iron', [shieldDefense]));
    shield.setEquipRules('handLeft');
    shield.take();
    player.equip(shield);

    test.equal(player.equipped(sword.get('_id')), 'handRight',
        'Player.equip(sword) does not work.');
    test.equal(player.equipped(shield.get('_id')), 'handLeft',
        'Player.equip(shield) does not work.');


});