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
            var story = Stories.findOne(storyId);
            if(story) {
                cb(story);
            }else{
                console.log('No story to tell...');
            }
        });
    };
    Spielebuch.updateText = function () {
        Spielebuch.getUsersStory(function(story){
                story.updateText();
        });
    };
}