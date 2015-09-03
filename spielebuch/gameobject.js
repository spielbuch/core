class Gameobject extends Base {
    constructor(arg0, arg1, arg2) {
        var fields = {
            'name': {
                type: String,
                default: 'Unnamed Object'
            },
            'referenceId': {
                type: String,
                default: 'global'
            },
            'userId': {
                type: String,
                default: 'global'
            },
            'effects': {
                type: Array,
                default: []
            },
            'events': {
                type: Object,
                default: {}
            },
            'overrides': {
                type: Object,
                default: {}
            }
        }, onCreateParams = {
            objectname: arg0,
            referenceId: arg1,
            userId: arg2
        }

        var superResult;
        if (arguments.length === 1) {
            superResult = super('Gameobjects', fields, arg0, {});
        } else {
            superResult = super('Gameobjects', fields, false, onCreateParams);
        }
        return superResult;
    }

    onCreate(params) {
        var self = this;
        Spielebuch.ServerLog('New Gameobject was created.');
        self.set('name', params.objectname);
        self.set('referenceId', params.referenceId);
        self.set('userId', params.userId);
    }
}
Spielebuch.Gameobject = Gameobject;
Spielebuch.Gameobjects = new Mongo.Collection('gameobjects');