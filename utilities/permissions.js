var ownStuff = {
    insert: function(userId, doc){
        return doc.userId === userId;
    },
    update: function(userId, doc){
        return doc.userId === userId;
    },
    remove: function(userId, doc){
        return doc.userId === userId;
    },
    fetch: ['userId']
}


Stories.allow(ownStuff);
Scenes.allow(ownStuff);
Gameobjects.allow(ownStuff);