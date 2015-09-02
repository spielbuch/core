Stories = new Mongo.Collection('stories');
Story = Astro.Class({
    name: 'Story',
    collection: Stories,
    transform: true,
    fields: {
        'userId': 'string',
        'scenes': {
            type: 'array',
            default: []
        },
        'sceneHistory': {
            type: 'array',
            default: []
        }
    },
    init: function (userId) {
        if (typeof userId !== 'string') {
            //in this case the object was fetched, we do nothing.
        } else {
            check(userId, String);
            this.userId = userId;
            this.save();
            var storyId = this.get('_id');
            Spielebuch.ServerLog('Creating story for user: ' + userId);
            Spielebuch.ServerLog('New story id: ' + storyId);
            Meteor.call('setUsersStory', storyId);
        }
    },
    methods: {
        addScene: function (scene) {
            scene.set('storyId', this._id);
            scene.set('userId', this.userId);
            scene.save();
            this.scenes.push(scene.get('_id'));
            Stories.update(this._id, {
                $push: {
                    scenes: scene.get('_id')
                }
            });

        },
        start: function (sceneId) {
            var playingScene = false;
            if (sceneId) {
                playingScene = this.scenes[sceneId];
            } else {
                playingScene = this.scenes[0];
            }

            if (!playingScene) {
                throw new Meteor.Error('500', 'This scene does not exist.');
            }

            Spielebuch.ServerLog('This story (' + this._id + ') starts with scene: ' + playingScene + ').');
            var result = Stories.update(this._id, {
                $push: {
                    sceneHistory: playingScene
                }
            });
            if (!result) {
                throw new Meteor.Error('500', 'Could not update the story while starting it.');
            }

        },
        playingScene: function () {
            if (this.sceneHistory.length === 0) {
                throw new Meteor.Error('500', 'This story has no scenes in history.');
            }
            var history = this.sceneHistory;
            Spielebuch.ServerLog('Playing scene ' + _.last(history) + '.')
            return Scenes.findOne(_.last(history));
        },
        updateText: function () {
            var scene = Scenes.findOne(_.last(this.sceneHistory));
            if (!scene) {
                throw new Meteor.Error('500', 'This scene does not exist.');
            }
            if (Meteor.isClient) {
                Session.set('storytext', scene.getText());
            } else {
                return scene.getText();
            }
        },
        removeScenes: function () {
            var scenes = this.scenes, storyId = this._id;
            Spielebuch.ServerLog('Scenes of story ('+storyId+') to clean up: ');
            Spielebuch.ServerLog(scenes);

            //this is a monkeypatch, I hope bulk remove comes soon to astronomy,
            //we have to destroy every gameobject of each scene of this story...
            _.forEach(scenes, function (sceneId) {
                Spielebuch.ServerLog('Removing objects of scene: ' + sceneId);
                Gameobjects.remove({referenceId: sceneId});
            });
            //then we remove the scene.
            var result = Scenes.remove({
                "storyId": storyId
            });
            Spielebuch.ServerLog('All scenes removed: ' + !!result);
            //monkeytime is over ;)

            /*
             if it is possible with the next release, we call remove and
             use the beforeremove event of the Scene-class to clean up.
             Scenes.find({
             "_id": {
             "$in": scenes
             }
             }).forEach(function (scene) {
             Spielebuch.ServerLog('Removing scene: ' + scene._id);
             scene.remove();
             });*/
            this.sceneHistory = [];
            this.scenes = [];
            this.save();
        }
    }
});

Spielebuch.Story = Story;
Spielebuch.Stories = Stories;