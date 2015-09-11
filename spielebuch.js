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
        debug: true
    }
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
                        if (!Meteor.userId()) {
                            //no user logged in. Ignore it silently.
                            return;
                        }

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
                            }

                        });
                        Spielebuch.log('Tracking scene.');

                        /**
                         * Keep track of the playingSceneId and change the text accordingly
                         */
                        Tracker.autorun(function () {
                            var playingScene = Spielebuch.Scenes.findOne(Session.get('playingSceneId'));
                            if (!playingScene) {
                                Spielebuch.error(404, 'The scene ' + Session.get('playingSceneId') + ' was not found in the database.');
                            } else {
                                Session.set('spielebuchText', playingScene.text);
                                Spielebuch.log('Text of scene was set.');
                                Session.set('spielebuchReady', true);
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

    Spielebuch.startUiCountdown = function (timeInMs, steps, cb) {
        var time = timeInMs;
        Session.set('criticalTiming', (time / timeInMs) * 100);
        var killSwitch = Meteor.setInterval(function () {
            time -= steps;
            Session.set('criticalTiming', (time / timeInMs) * 100);
            if (time < 0) {
                Session.set('criticalTiming', 0);
                Gamebook.stopCountdown(killSwitch);
                return cb();
            }
        }, steps);
        return killSwitch;
    };

    Spielebuch.startSilentCountdown = function (timeInMs, steps, cb) {
        var time = timeInMs,
            killSwitch = Meteor.setInterval(function () {
                time -= steps;
                if (time < 0) {
                    Gamebook.stopCountdown(killSwitch);
                    return cb();
                }
            }, steps);
        return killSwitch;
    };

    Spielebuch.stopCountdown = function (killSwitch) {
        Meteor.clearInterval(killSwitch);
        Meteor.setTimeout(function () {
            Session.set('criticalTiming', 0);
        }, 2000);
    };

    Spielebuch.global = {};
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