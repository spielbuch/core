if (Meteor.isClient) {
    Session.setDefault('storyId', -1);
    Session.setDefault('playingSceneId', -1);
    Session.setDefault('spielebuchText', -1);
    Session.set('spielebuchReady',false);
    Accounts.onLogin(Spielebuch.init);
    Meteor.startup(Spielebuch.init);
}