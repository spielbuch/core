Spielebuch = {
    Settings: {
        debug: true
    }
};

/**
 * Functions that exist only on the client.
 */
if (Meteor.isClient) {
    Spielebuch.getText = function () {
        if (Session.get('storyId') === -1) {
            //User is not logged-in (yet)
            return [];
        }
        var scene = new Spielebuch.Story(Session.get('storyId')).playingScene();
        if(scene) {
            return scene.getText();
        }
        return [];
    };
    Spielebuch.subscribe = function () {
        if (Session.get('storyId') !== -1) {
            //onStartup has already been executed
            return;
        }
        if (Meteor.user()) {
            Meteor.subscribe('userStory', {
                onReady: function () {
                    var storyId = Meteor.user().storyId;
                    if (storyId) {
                        Session.set('storyId', storyId);
                    } else {
                        throw new Meteor.Error('500', 'The user has no story. Fix it with Story.addPlayer(userId).');
                    }
                },
                onError: function () {
                    throw new Meteor.Error('500', 'Something went wrong with the subscription.');
                }
            });
        }
    };
}