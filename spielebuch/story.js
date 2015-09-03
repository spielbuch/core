class Story extends Base {
    constructor(_id) {
        var fields = {
                'userId': {
                    type: String,
                    default: 'global'
                },
                'scenes': {
                    type: Array,
                    default: []
                },
                'history': {
                    type: Array,
                    default: []
                }
            }, onCreateParams = {},
            superResult;

        if (arguments.length === 1) {
            superResult = super('Stories', fields, _id, {});
        } else {
            superResult = super('Stories', fields, false, onCreateParams);
        }
        return superResult;

    }


    onCreate(params) {
        var self = this;
    }


    addPlayer(userId) {
        var self = this;
        if (Meteor.isServer) {
            self.set('userId', userId);
            var update = Meteor.users.update(userId, {
                $set: {
                    storyId: self._id
                }
            });
            Spielebuch.ServerLog('Userdoc update worked: ' + !!update);

            update = Spielebuch.Scenes.update({storyId: self._id}, {
                $set: {userId: userId}
            });
            Spielebuch.Scenes.find({storyId: self._id}).forEach(function(doc){
                Spielebuch.Gameobjects.update({referenceId: doc._id},{
                    $set: {userId: userId}
                })
            });
            Spielebuch.ServerLog('Scenedocs update worked: ' + !!update);

        }
    }

    playingScene(){
        var self = this;
        return new Spielebuch.Scene(self.last('history'));
    }

    addScene(scene) {
        var self = this;
        scene.set('storyId', self._id);

        scene.set('userId', self.get('userId'));
        self.push('scenes', scene.get('_id'));
    }

    start(sceneId) {
        var playingScene = false, self = this;
        if (sceneId) {
            playingScene = self.get('scenes')[sceneId];
        } else {
            playingScene = self.get('scenes')[0];
        }
        if (!playingScene) {
            throw new Meteor.Error('500', 'This scene does not exist.');
        }
        Spielebuch.ServerLog('This story (' + self._id + ') starts with scene: ' + playingScene + ').');
        self.push('history', playingScene);
    }

    removeScenes() {
        var self = this, scenes = self.scenes, storyId = self._id;
        Spielebuch.ServerLog('Scenes of story (' + storyId + ') to clean up: ');
        Meteor.call('deleteScenesOfStory', storyId);

        //then we remove the scene from the object.
        self.set('history', []);
        self.set('scenes', []);
    }


}

Spielebuch.Story = Story;
Spielebuch.Stories = new Mongo.Collection('stories');