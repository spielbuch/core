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
    Spielebuch.init = function () {
        Session.set('spielebuchReady',false);
        if (Session.get('storyId') !== -1) {
            //onStartup has already been executed
            return;
        }
        if (Meteor.user()) {
            Meteor.subscribe('userStory', {
                    onReady: function () {
                        if (!Meteor.user()) {
                            //no user logged in. Ignore it silently.
                            return;
                        }
                        var storyId = Meteor.user().storyId;
                        if (!storyId) {
                            Spielebuch.error(500, 'There is no story set.');
                            return;
                        }
                        var story = Spielebuch.Stories.findOne(storyId);
                        if (!story) {
                            Spielebuch.error(404, 'The story ' + storyId + ' was not found in database.');
                            return;
                        }
                        var playingSceneId = _.last(story.history);
                        if (playingSceneId) {
                            Session.set('playingSceneId', playingSceneId);
                        }
                        if (Session.get('playingSceneId') === -1) {
                            //There is no playing story,
                            Spielebuch.error(404, 'There is no scene in story ' + Session.get('storyId') +
                                ' history. Make sure that you called \'Story.start()\'.');
                            return;
                        }
                        var playingScene = Spielebuch.Scenes.findOne(playingSceneId);
                        if (!playingScene) {
                            Spielebuch.error(404, 'The scene '+playingScene+' was not found in the database.');
                            return;
                        }
                        Session.set('spielebuchReady',true);
                        Session.set('spielebuchText', playingScene.text);
                        observeStory();


                    },
                    onError: function () {
                        Spielebuch.error(500, 'Something went wrong with the subscription.');
                    }
                }
            );
        }
    };


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
}