User = Astro.Class({
    name: 'User',
    collection: Meteor.users,
    fields: {
        emails: 'array',
        services: 'object',
        createdAt: 'date',
        profile: 'object'
    },
    methods: {
        setStoryId: function (storyId) {
            this.storyId = storyId;
            this.save();
        },
        getStory: function () {
            return Stories.findOne(this.storyId);
        },
        getStoryId: function(){
            return this._id;
        }
    },
    events: {
        beforeremove: function () {
            var story = Stories.findOne(this.storyId);
            story.remove();
        }
    }
});

