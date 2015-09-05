class Gameobject extends HasEffects {
    constructor(objectname, referenceId, userId) {
        super();
        var self = this;
        if(self.created){
            self.onCreate();
        }
    }

    onCreate(objectname, referenceId, userId) {
        var self = this;
        Spielebuch.log('New Gameobject was created.');
        self.set('name', objectname);
        self.set('referenceId', referenceId);
        self.set('userId', userId);
    }


    getFields(){
        return {
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
        };
    }
    getCollection(){
        return 'Gameobjects';
    }
}
Spielebuch.Gameobject = Gameobject;
Spielebuch.Gameobjects = new Mongo.Collection('gameobjects');