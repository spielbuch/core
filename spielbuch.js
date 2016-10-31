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

Spielbuch = {
    Settings: {
        debug: true,
        language: 'en'
    },
    Gameplay: {
        hitpoints: 'Hitpoints',
        damage: 'Damage',
        defense: 'Defense'
    },
    /**
     * If the author is in need of a global variable, he can dump it in here.
     */
    globals: {}
};

/**
 * Functions that exist only on the client.
 */
if (Meteor.isClient) {
    Spielbuch.init = function (cb) {
        Spielbuch.log('Initializing story...')
        Session.set('spielbuchReady', false);
        if (Meteor.user()) {
            Spielbuch.log('Subscribing...')
            Meteor.subscribe('userStory', {
                    onReady: function () {
                        Spielbuch.log('Subscription is ready.')
                        /**
                         * Keep track of user's story
                         */
                        Tracker.autorun(function () {
                            var story = new Spielbuch.Story();
                            var loaded = story.load(Meteor.userId());
                            if (!loaded) {
                                Spielbuch.error(500, 'There is no story set.');
                                return;
                            }
                            Spielbuch.log('Found story.');
                            Spielbuch.story.set(story);
                            Spielbuch.player.set(story.getPlayer());

                            Session.set('storyId', story.get('_id'));
                        });
                        Spielbuch.log('Tracking story.');

                        /**
                         * Keep track of storyId and set the playing scene accordingly
                         */
                        Tracker.autorun(function () {
                            var story = Spielbuch.Stories.findOne(Session.get('storyId')), playingSceneId;
                            if (!story) {
                                Spielbuch.error(404, 'There is no story ' + Session.get('storyId') + '.');
                                return;
                            }
                            playingSceneId = _.last(story.history);
                            if (!playingSceneId) {
                                Spielbuch.error(404, 'There is no scene in story ' + Session.get('storyId') +
                                    ' history. Make sure that you called \'Story.start()\'.');
                            } else {
                                Session.set('playingSceneId', playingSceneId);
                                var scene = new Spielbuch.Scene(Meteor.userId());
                                scene.load(playingSceneId);
                                Spielbuch.scene.set(scene);
                            }

                        });
                        Spielbuch.log('Tracking scene.');

                        /**
                         * Keep track of the playingSceneId and change the text accordingly
                         */
                        Tracker.autorun(function () {
                            var scene = Spielbuch.scene.get();
                            if(scene) {
                                Spielbuch.log('Text of scene was set.');
                                Session.set('spielbuchReady', true);
                                Session.set('spielbuchText', scene.getText());
                            }else{
                                Session.set('spielbuchReady', false);
                            }

                        });
                        Spielbuch.log('Tracking text.');

                        Spielbuch.log('Spielbuch:core is ready.');
                        return cb();
                    },
                    onError: function (err) {
                        Spielbuch.error(500, 'Something went wrong with the subscription.');
                        return cb(err);
                    }
                }
            );
        }
    };
    Spielbuch.story = new ReactiveVar(false);
    Spielbuch.scene = new ReactiveVar(false);
    Spielbuch.player = new ReactiveVar(false);

}

/**
 * Please do not change this comment,
 * and please do not change this line.
 * If you change this line (I know you want to) make sure that the user of this package still has the copyright-notice, a link to the source, the license and me (email: spielbuch@budick.eu).
 * Use this notice on a prominent place (e.g. footer) and add a link to the repository with the code you use, and we are good ;)
 * - Daniel Budick-
 */
Spielbuch.copyrightNotice = 'This application is based on <a href=\"https://github.com/spielbuch/core\" title=\"Spielbuch is a framework to create interactive books\">Spielbuch</a>.<br/>' +
    'Copyright 2015 Daniel Budick, All rights reserved.' +
    'Spielbuch is free software: you can redistribute it and/or modify it under the terms of the <a href=\"https://github.com/spielbuch/core/blob/master/LICENSE\">GNU Affero General Public License</a>.<br/>' +
    'To get a commercial license, you can contact spielbuch@budick.eu';