observeStory = function (storyId) {
    var queryUser = Meteor.users.find({_id: Meteor.userId()});
    queryUser.observeChanges({
        changed: function(_id, fields){
            if(Meteor.user().storyId) {
                Session.set('storyId', Meteor.user().storyId);
            }else{
                Session.set('storyId', -1);
            }
        }
    });

    var queryStory = Spielebuch.Stories.find({_id: Session.get('storyId')});
    queryStory.observeChanges({
        changed: function(_id, fields){
            console.log(fields);
        }
    });
    var queryScene = Spielebuch.Scenes.find({storyId: Session.get('playingSceneId')});
    queryScene.observeChanges({
        changed: function(_id, fields) {
            Session.set('playingSceneId', _.last(Spielebuch.Stories.findOne(Meteor.user().storyId).history));
            console.log(fields);
        }
    });
}