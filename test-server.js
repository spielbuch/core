/**
 * Created by Daniel Budick on 01 Okt 2015.
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

Tinytest.add('Test Spielebuch constructors', function (test) {
    var userId = '1234asdf';
    var story = new Spielebuch.Story(userId);
    test.isTrue(function(){
        return story.created && story.get('userId')===userId;
    },'Story does not work.');

    var player = story.createPlayer();
    test.isTrue(function(){
        return player.get('userId')===userId;
    },'Player does not work.');

    var sceneOne = story.addScene();
    var firstScene = sceneOne.index;
    story.start(firstScene);
    var sceneId = sceneOne.get('_id');

    test.isTrue(function(){
        var playingSceneId = _.last(story.history);
        return sceneId === playingSceneId;
    },'Adding scenes does not work.');


    var holzTischText = 'In der Mitte steht ein alter, nasser und halbverotteter [Holztisch](wooden_table).';
    var holztisch = sceneOne.addText(holzTischText);
    test.isTrue(function(){
        return sceneOne === holztisch.get('referenzeId');
    },'Adding text does not work.');
});