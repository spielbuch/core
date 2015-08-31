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
Scene = Astro.Class({
    name: 'Scene',
    collection: Scenes,
    fields: {
        'storyId': 'string',
        'text': 'array',
        'effects': 'array',
        'effects': 'object',
    },
    init: function (storyId) {  // Constructor
        this.storyId = storyId;
        this.text = [];
        this.effects = [];
        this.hooks = {};
        this.save();
    },
    methods: {
        load: function (_id) {
            var scene = Scenes.findOne(_id);
            this.storyId = scene.storyId;
            this.text = scene.text;
            this.effects = scene.effects;
            this.hooks = scene.hooks;
            this.save();
        },
        addText: function(text){
            var markedText = createObjectsFromText(text);
            this.text.push(markedText);
            this.save();
        },
        getText: function(){
            var text = '';
            _.forEach(this.text, function(text){
                text += ' ' + text;
            });
            return text;
        }
    }
});

Spielebuch.Scene = Scene;