Spielebuch = {};

Spielebuch.getText = function(storyId){
    return Meteor.call('getText');
}