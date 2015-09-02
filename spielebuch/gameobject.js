Gameobjects = new Mongo.Collection('gameobjects');
Gameobject = Astro.Class({
    name: 'Gameobject',
    collection: Gameobjects,
    transform: true,
    fields: {
        'name': 'string',
        'referenceId': 'string',
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
    },
    init: function (name, referenceId) {  // Constructor
        if (typeof name === 'object') {
            //in this case the object was fetched, we do nothing.
        } else {
            this.name = name;
            this.referenceId = referenceId;
            this.save();
        }
    },
    methods: {


    }
});

Spielebuch.Gameobject = Gameobject;