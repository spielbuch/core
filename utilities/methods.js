Meteor.methods({
    setUsersStory: function (storyId) {
        if (this.userId === null) {
            throw new Meteor.Error('403', 'User is not logged in.');
        }
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


    /**
     * These methods are used to delete stuff.
     */
    deleteStoryOfUser: function () {
        if (this.userId === null) {
            throw new Meteor.Error('403', 'User is not logged in.');
        }
        Spielebuch.ServerLog('Deleting stories of user: ' + this.userId);
        Stories.find({
            'userId': this.userId
        }).map(function (story) {
            Meteor.call('deleteScenesOfStory', story._id);
            Stories.remove(story._id);
        });
    },
    deleteScenesOfStory: function (storyId) {
        var error, result;
        if (this.userId === null) {
            throw new Meteor.Error('403', 'User is not logged in.');
        }
        Scenes.find({
            'userId': this.userId
        }).map(function (scene) {
            Meteor.call('deleteGameobjectsOfReference', scene._id);
            result = Scenes.remove(scene._id);
            if(!result){
                error = true;
            }
        });
        result = Stories.update(storyId, {
            $set: {
                scenes: [],
                history: []
            }
        });
        result = result && !error
        Spielebuch.ServerLog('All scenes removed: ' + result);
    },
    deleteGameobjectsOfReference: function (referenceId) {
        if (this.userId === null) {
            throw new Meteor.Error('403', 'User is not logged in.');
        }
        Spielebuch.ServerLog('Removing objects of reference (user or scene): ' + referenceId);
        Gameobjects.remove({referenceId: referenceId});
    }
});