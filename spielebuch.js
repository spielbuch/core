Spielebuch = {
    Settings: {
        debug: true
    }
};

/**
 * Functions that exist only on the client.
 */
if(Meteor.isClient) {
    Spielebuch.getUsersStory = function(cb){
        return Meteor.call('getUsersStoryId',function(err, storyId){
            if(err){
                console.error(err.error, err.reason);
            }
            if(storyId) {
                cb(new Spielebuch.Story(storyId));
            }else{
                console.error(404, 'No story to tell...');
            }
        });
    };
    Spielebuch.updateText = function () {
        Spielebuch.getUsersStory(function(story){
                story.updateText();
        });
    };
}