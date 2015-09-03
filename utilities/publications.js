Meteor.publish('userStory', function () {
    return [
        Meteor.users.find({_id: this.userId},
        {fields: {storyId: 1}}),
        Spielebuch.Stories.find({userId: this.userId}, {
            fields: {scenes: 1, history: 1, userId: 1 }
        }),
        Spielebuch.Scenes.find({userId: this.userId}, {
            fields: {effects: 1, hooks: 1, storyId: 1, text: 1, userId: 1 }
        }),
        Spielebuch.Gameobjects.find({userId: this.userId}, {
            fields: {effects: 1, events: 1, name: 1, overrides: 1, userId: 1, referenceId: 1 }
        })
    ];
});