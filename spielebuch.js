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

Spielebuch = {
    Settings: {
        debug: true,
        language: 'en'
    },
    Gameplay: {
        hitpoints: 'Hitpoints',
        damage: 'Damage'
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
    Spielebuch.init = function (cb) {
        Spielebuch.log('Initializing story...')
        Session.set('spielebuchReady', false);
        if (Meteor.user()) {
            Spielebuch.log('Subscribing...')
            Meteor.subscribe('userStory', {
                    onReady: function () {
                        Spielebuch.log('Subscription is ready.')
                        /**
                         * Keep track of user's story
                         */
                        Tracker.autorun(function () {
                            var story = new Spielebuch.Story();
                            var loaded = story.load(Meteor.userId());
                            if (!loaded) {
                                Spielebuch.error(500, 'There is no story set.');
                                return;
                            }
                            Spielebuch.log('Found story.');
                            Spielebuch.story.set(story);
                            Spielebuch.player.set(story.getPlayer());

                            Session.set('storyId', story.get('_id'));
                        });
                        Spielebuch.log('Tracking story.');

                        /**
                         * Keep track of storyId and set the playing scene accordingly
                         */
                        Tracker.autorun(function () {
                            var story = Spielebuch.Stories.findOne(Session.get('storyId')), playingSceneId;
                            if (!story) {
                                Spielebuch.error(404, 'There is no story ' + Session.get('storyId') + '.');
                                return;
                            }
                            playingSceneId = _.last(story.history);
                            if (!playingSceneId) {
                                Spielebuch.error(404, 'There is no scene in story ' + Session.get('storyId') +
                                    ' history. Make sure that you called \'Story.start()\'.');
                            } else {
                                Session.set('playingSceneId', playingSceneId);
                                var scene = new Spielebuch.Scene(Meteor.userId());
                                scene.load(playingSceneId);
                                Spielebuch.scene.set(scene);
                            }

                        });
                        Spielebuch.log('Tracking scene.');

                        /**
                         * Keep track of the playingSceneId and change the text accordingly
                         */
                        Tracker.autorun(function () {
                            var scene = Spielebuch.scene.get();
                            if(scene) {
                                Spielebuch.log('Text of scene was set.');
                                Session.set('spielebuchReady', true);
                                Session.set('spielebuchText', scene.getText());
                            }else{
                                Session.set('spielebuchReady', false);
                            }

                        });
                        Spielebuch.log('Tracking text.');

                        Spielebuch.log('Spielebuch:core is ready.');
                        return cb();
                    },
                    onError: function (err) {
                        Spielebuch.error(500, 'Something went wrong with the subscription.');
                        return cb(err);
                    }
                }
            );
        }
    };
    Spielebuch.story = new ReactiveVar(false);
    Spielebuch.scene = new ReactiveVar(false);
    Spielebuch.player = new ReactiveVar(false);
}

/**
 * Please do not change this comment,
 * and please do not change this line.
 * If you change this line (I know you want to) make sure that the user of this package still has the copyright-notice, a link to the source, the license and me (email: spielebuch@budick.eu).
 * Use this notice on a prominent place (e.g. footer) and add a link to the repository with the code you use, and we are good ;)
 * - Daniel Budick-
 */
Spielebuch.copyrightNotice = 'This application is based on <a href=\"https://github.com/spielebuch/core\" title=\"Spielebuch is a framework to create interactive books\">Spielebuch</a>.<br/>' +
    'Copyright 2015 Daniel Budick, All rights reserved.' +
    'Spielebuch is free software: you can redistribute it and/or modify it under the terms of the <a href=\"https://github.com/spielebuch/core/blob/master/LICENSE\">GNU Affero General Public License</a>.<br/>' +
    'To get a commercial license, you can contact spielebuch@budick.eu';