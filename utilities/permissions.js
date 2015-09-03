var ownStuff = {
    update: function(userId, doc){
        return doc.userId === userId || doc.userId === 'global';
    },
    fetch: ['userId']
};

Spielebuch.Stories.allow(ownStuff);
Spielebuch.Scenes.allow(ownStuff);
Spielebuch.Gameobjects.allow(ownStuff);