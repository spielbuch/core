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
                            return
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
}