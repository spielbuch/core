Meteor.methods({
    setUsersStory: function (storyId) {
        Spielebuch.ServerLog('Setting story ' + storyId + ' for user ' + this.userId + '.');
        check(storyId, String);
        if (this.userId === null) {
            throw new Meteor.Error('403', 'User is not logged in.');
        }
        var update = Meteor.users.update(this.userId, {
            $set: {
                storyId: storyId
            }
        });
        Spielebuch.ServerLog('Userdoc update worked: ' + !!update);
    },
    getUsersStoryId: function () {
        if (this.userId === null) {
            throw new Meteor.Error('403', 'User is not logged in.');
        }
        var user = Meteor.users.findOne(this.userId);
        Spielebuch.ServerLog('Fetching user\'s (' + this.userId + ') storyId (' + user.storyId + ').');
        return user.storyId;
    },
    deleteUsersStory: function () {
        if (this.userId === null) {
            throw new Meteor.Error('403', 'User is not logged in.');
        }
        Spielebuch.ServerLog('Deleting stories of user: ' + this.userId);
        Stories.find({
            'userId': this.userId
        }).forEach(function (story) {
            story.removeScenes();
            story.remove();
        });
    }
});