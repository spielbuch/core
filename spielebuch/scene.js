Scenes = new Mongo.Collection('scenes');

class Scene extends Base {
    constructor(_id) {
        var fields = {
            'storyId': 'string',
            'userId': 'string',
            'text': {
                type: 'array',
                default: []
            },
            'effects': {
                type: 'array',
                default: []
            },
            'hooks': {
                type: 'object',
                default: {}
            }
        }
        return super(Scenes, fields, _id, []);
    }

    addText(text) {
        var self = this;
        var markedText = self.createObjectsFromText(text);
        var result = Scenes.update(self._id, {
            $push: {
                text: markedText
            }
        });
        console.log('Updated text: ' + !!result);
    }

    getText() {
        var text = '';
        _.forEach(this.text, function (textpart) {
            text += ' ' + textpart;
        });
        console.log(this.text);
        return text;
    }
    removeGameobjects() {

    }

    /**
     * Creates gameobjets from a text with markup.
     * Changes the markuped text, that the objectnames are replaced by the _ids of the created objects.
     * @param text: Text with markdown, that will be searched for gameobjects
     * @param referenceId: The _id of the place, the object is in (_id of scene or user)
     * @returns {{gameobjects: Array, text: String}}
     */
    createObjectsFromText(text, referenceId) {
        var self = this;
        var re = /[^[\]]+(?=])/, objectnames = re.exec(text);

        _.forEach(objectnames, function (objectName) {
            var newGameobject = new Gameobject(objectName, self._id);
            text.replace(new RegExp('\\[' + objectName + '\\]', 'g'), newGameobject._id);
        });

        return text;
    };


};
Spielebuch.Scene = Scene;
Spielebuch.Scenes = Scenes;