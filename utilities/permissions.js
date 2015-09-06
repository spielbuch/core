
//todo: Forbid client to set any function (hooks, events etc.) for it would be embarrassing...
var ownStuff = {
    update: function(userId, doc){
        return doc.userId === userId || doc.userId === 'global';
    },
    fetch: ['userId']
};

Spielebuch.Stories.allow(ownStuff);
Spielebuch.Scenes.allow(ownStuff);
Spielebuch.Gameobjects.allow(ownStuff);