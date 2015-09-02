Meteor.publish("userStory", function () {
    return [
        Meteor.users.find({_id: this.userId},
        {fields: {'storyId': 1}}),
        Stories.find({userId: this.userId}),
        Scenes.find({userId: this.userId}),
        Gameobjects.find({userId: this.userId})
    ];
});