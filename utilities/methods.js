Meteor.methods({
    getUsersStoryId: function () {
        if (this.userId === null) {
            Spielebuch.error('403', 'User is not logged in.');
        }
        var user = Meteor.users.findOne(this.userId);
        Spielebuch.log('Fetching user\'s (' + this.userId + ') storyId (' + user.storyId + ').');
        return user.storyId;
    },


    /**
     * These methods are used to delete stuff.
     */
    deleteStoryOfUser: function () {
        if (this.userId === null) {
            Spielebuch.error('403', 'User is not logged in.');
        }
        Spielebuch.log('Deleting stories of user: ' + this.userId);
        Spielebuch.Stories.find({
            'userId': this.userId
        }).map(function (story) {
            Meteor.call('deleteScenesOfStory', story._id);
            Spielebuch.Stories.remove(story._id);
        });
    },
    deleteScenesOfStory: function (storyId) {
        var error, result;
        if (this.userId === null) {
            Spielebuch.error('403', 'User is not logged in.');
        }
        Spielebuch.Scenes.find({
            'userId': this.userId
        }).map(function (scene) {
            Meteor.call('deleteGameobjectsOfReference', scene._id);
            result = Spielebuch.Scenes.remove(scene._id);
            if(!result){
                error = true;
            }
        });
        result = Spielebuch.Stories.update(storyId, {
            $set: {
                scenes: [],
                history: []
            }
        });
        result = result && !error
        Spielebuch.log('All scenes removed: ' + result);
    },
    deleteGameobjectsOfReference: function (referenceId) {
        if (this.userId === null) {
            Spielebuch.error('403', 'User is not logged in.');
        }
        Spielebuch.log('Removing objects of reference (user or scene): ' + referenceId);
        Spielebuch.Gameobjects.remove({referenceId: referenceId});
    }
});