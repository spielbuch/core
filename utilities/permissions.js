Stories.allow({
    update: function(userId, doc){
        return doc.userId === userId;
    },
    fetch: ['userId']
});