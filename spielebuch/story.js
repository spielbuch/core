Stories = new Mongo.Collection('stories');

class Story extends Base {
    constructor(userId, _id) {
        var fields = {
            'userId': 'string',
            'scenes': {
                type: 'array',
                default: []
            },
            'sceneHistory': {
                type: 'array',
                default: []
            }
        };
        return super(Stories, fields, _id, {userId: userId});
    }

    onCreate(params) {
        var userId = params.userId, self = this;
        check(userId, String);
        self.values.userId = userId;
        self.save();
        var storyId = self.get('_id');
        Spielebuch.ServerLog('Creating story for user: ' + userId);
        Spielebuch.ServerLog('New story id: ' + storyId);
        Meteor.call('setUsersStory', storyId);
    }


    addScene(scene) {
        console.log(scene);
        scene.set('storyId', this._id);
        scene.set('userId', this.userId);
        console.log(scene.get('_id'))
        this.scenes.push(scene.get('_id'));
        Stories.update(this._id, {
            $push: {
                scenes: scene.get('_id')
            }
        });
    }

    start(sceneId) {
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
    }

    playingScene() {
        if (this.sceneHistory.length === 0) {
            throw new Meteor.Error('500', 'This story has no scenes in history.');
        }
        var history = this.sceneHistory;
        Spielebuch.ServerLog('Playing scene ' + _.last(history) + '.')
        return Scenes.findOne(_.last(history));
    }

    updateText() {
        var scene = Scenes.findOne(_.last(this.sceneHistory));
        if (!scene) {
            throw new Meteor.Error('500', 'This scene does not exist.');
        }
        if (Meteor.isClient) {
            Session.set('storytext', scene.getText());
        } else {
            return scene.getText();
        }
    }

    removeScenes() {
        var scenes = this.scenes, storyId = this._id;
        Spielebuch.ServerLog('Scenes of story (' + storyId + ') to clean up: ');
        Spielebuch.ServerLog(scenes);

        //we have to destroy every gameobject of each scene of this story...
        _.forEach(scenes, function (sceneId) {

        });
        //then we remove the scene.


        this.sceneHistory = [];
        this.scenes = [];
        this.save();
    }
}

Spielebuch.Story = Story;
Spielebuch.Stories = Stories;