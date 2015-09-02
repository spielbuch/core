Gameobjects = new Mongo.Collection('gameobjects');

class Gameobject extends Base {
    constructor(objectname, referenceId, _id) {
        var fields = {
            'name': 'string',
            'referenceId': 'string',
            'userId': 'string',
            'effects': {
                type: 'array',
                default: []
            },
            'events': {
                type: 'object',
                default: {}
            },
            'overrides': {
                type: 'object',
                default: {}
            }
        };

        return super(Gameobjects, fields, _id, {objectname: objectname, referenceId: referenceId});
    }

    onCreate(params) {
        var self = this;
        self.onCreate();
        self.values.name = params.objectname;
        self.values.referenceId = params.referenceId;
        self.save();
    }
}
Spielebuch.Gameobject = Gameobject;
Spielebuch.Gameobjects = Gameobjects;