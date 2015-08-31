Stories = new Mongo.Collection('stories');
Story = Astro.Class({
    name: 'Story',
    collection: Stories,
    transform: true,
    fields: {
        'userId': 'string',
        'scenes': 'array',
        'sceneHistory': 'array'
    },
    init: function (userId) {  // Constructor
        this.userId = userId;
        this.scenes = [];
        this.sceneHistory = [];
        this.save();
    },
    methods: {
        load: function (_id) {
            var story = Stories.findOne(_id);
            this.userId = story.userId;
            this.scenes = story.scenes;
            this.sceneHistory = story.sceneHistory;
            this.save();
        },
        addScene: function (scene) {
            scene.save();
            this.scenes.push(scene._id);
            this.save();
        },
        start: function (sceneId) {
            var playingScene;
            if (sceneId) {
                playingScene = this.scenes[sceneId];
            } else {
                playingScene = this.scenes[0];
            }

            if (!playingScene) {
                throw new Meteor.Error("500", "This scene does not exist.");
            }

            this.sceneHistory.push(playingScene);

            this.save();
        },
        playingScene: function () {
            /*var scene = new Scene();
            scene.load(_.last(this.sceneHistory))*/

            return Scene.findOne(_.last(this.sceneHistory));
        }
    }
});

Spielebuch.Story = Story;