class Scene extends Base {
    constructor(_id) {
        var fields = {
                'storyId': {
                    type: String,
                    default: 'global'
                },
                'userId': {
                    type: String,
                    default: 'global'
                },
                'text': {
                    type: Array,
                    default: []
                },
                'effects': {
                    type: Array,
                    default: []
                },
                'hooks': {
                    type: Object,
                    default: {}
                }
            }, onCreateParams = {},
            superResult;

        if (arguments.length === 1) {
            superResult = super('Scenes', fields, _id, {});
        } else {
            superResult = super('Scenes', fields, false, onCreateParams);
        }
        return superResult;
    }

    onCreate() {
    }

    /**
     * Creates gameobjets from a text with markup.
     * Changes the markuped text, that the objectnames are replaced by the _ids of the created objects.
     * @param text: Text with markdown, that will be searched for gameobjects
     * @param referenceId: The _id of the place, the object is in (_id of scene or user)
     * @returns {{gameobjects: Array, text: String}}
     */
    addText(text) {
        var self = this, re = /[^[\]]+(?=])/, objectnames = re.exec(text), gameobjectArray = [];
        _.forEach(objectnames, function (objectName) {
            var newGameobject = new Spielebuch.Gameobject(objectName, self._id, self.get('userId'));
            text = text.replace(new RegExp('\\[' + objectName + '\\]', 'g'), '[' + newGameobject.get('_id') + ']');
            console.log(text);
            gameobjectArray.push(newGameobject);
        });
        self.push('text', text);
        Spielebuch.ServerLog('Added text to scene ' + self._id + '.');
        return gameobjectArray;
    }

    getText() {
        var self = this;
        return self.get('text');
    }

    removeGameobjects() {
        var self = this;
        Meteor.call('deleteGameobjectsOfReference', self._id);
    }
}
;
Spielebuch.Scene = Scene;
Spielebuch.Scenes = new Mongo.Collection('scenes');
;