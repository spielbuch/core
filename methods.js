Meteor.methods({
    'getText': function(){
        if(this.userId===null){
            throw new Meteor.Error("403", "User is not logged in.");
        }
        var storyId = Meteor.users.findOne(this.userId).profile.story;
        var story = Stories.findOne(storyId);
        console.log(story);
        var scene = story.playingScene();
        return scene.getText();
    }
});