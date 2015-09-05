class Scene extends Base {
    constructor() {
        super();
        var self = this;
        if(self.created){
            self.onCreate();
        }
    }
    getFields(){
        return {
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
        };
    }

    getCollection(){
        return 'Scenes';
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
        var self = this, re = /[^[\]]+(?=])/, objects = re.exec(text), objectname, gameobject;

        if(objects!==null){
            objectname = objects[0];
            gameobject = new Spielebuch.Gameobject(objectname, self._id, self.get('userId'));
            text = text.replace(new RegExp('\\[' + objectname + '\\]', 'g'), '[' + gameobject.get('_id') + ']');
        }
        self.push('text', text);
        Spielebuch.log('Added text to scene ' + self._id + '.');
        return gameobject;
    }

    removeGameobjects() {
        var self = this;
        Meteor.call('deleteGameobjectsOfReference', self._id);
    }
}
;
Spielebuch.Scene = Scene;
Spielebuch.Scenes = new Mongo.Collection('scenes');

