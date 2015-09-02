/**
 * Creates gameobjets from a text with markup.
 * Changes the markuped text, that the objectnames are replaced by the _ids of the created objects.
 * @param text: Text with markdown, that will be searched for gameobjects
 * @param referenceId: The _id of the place, the object is in (_id of scene or user)
 * @returns {{gameobjects: Array, text: String}}
 */
var createObjectsFromText = function (text, referenceId) {
    var re = /[^[\]]+(?=])/, objectnames = re.exec(text);

    _.forEach(objectnames, function (objectName) {
        var newGameobject = new Gameobject(objectName, referenceId);
        text.replace(new RegExp('\\[' + objectName + '\\]', 'g'), newGameobject._id);
    });

    return text;
};
Scenes = new Mongo.Collection('scenes');
class Scene{
    constructor(_id){
        this.fields = {
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
        };
        this.collection = Scenes;
        if(_id){
            this.values = ORM.setFields(_id, this);
        }else{
            //scene is created
        }
    };

    addText(text) {
        var markedText = createObjectsFromText(text);
        var result = Scenes.update(this._id, {
            $push: {
                text: markedText
            }
        });
        console.log('Updated text: ' + !!result);
    };
    getText() {
        var text = '';
        _.forEach(this.text, function (textpart) {
            text += ' ' + textpart;
        });
        console.log(this.text);
        return text;
    };
    removeGameobjects() {

    }
};
Spielebuch.Scene = Scene;
Spielebuch.Scenes = Scenes;