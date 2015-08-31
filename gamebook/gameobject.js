Gameobjects = new Mongo.Collection('gameobjects');
Gameobject = Astro.Class({
    name: 'Gameobject',
    collection: Gameobjects,
    fields: {
        'name': 'string',
        'effects': 'array',
        'events': 'object',
        'overrides': 'object',
        'referenceId': 'string',
    },
    init: function (name, referenceId) {  // Constructor
        this.name = name;
        this.effects = [];
        this.events = {};
        this.overrides = {};
        this.referenceId = referenceId;
        this.save();
    },
    methods: {
        load: function (_id) {
            var gameobject = Gameobjects.findOne(_id);
            this.name = gameobject.name;
            this.effects = gameobject.effects;
            this.events = gameobject.events;
            this.overrides = gameobject.overrides;
            this.referenceId = gameobject.referenceId;
            this.save();
        },
    }
});

Spielebuch.Gameobject = Gameobject;