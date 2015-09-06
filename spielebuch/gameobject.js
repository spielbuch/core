class Gameobject extends HasEffects {
    constructor(objectname, referenceId, userId) {
        super();
        var self = this;
        if(self.created){
            self.onCreate(objectname, referenceId, userId);
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

    getEvents(){
        var self = this;
        //return _.keys(self.get('events'));
        return [
            //{name:'explore',icon:'fa-info'},
            {name:'interact',icon:'fa-info'},
            {name:'attack',icon:'fa-info'},
            {name:'walk',icon:'fa-info'}
        ];

    }

    setEvent(){
        if(Meteor.isServer){

        }else{
            Spielebuch.error(500, 'The client is not allowed to set an event, for it would be madness!');
        }
    }

    getCollection(){
        return 'Gameobjects';
    }
}
Spielebuch.Gameobject = Gameobject;
Spielebuch.Gameobjects = new Mongo.Collection('gameobjects');