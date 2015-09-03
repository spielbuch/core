if (Meteor.isServer) {
    Accounts.onCreateUser(function (options, user) {
        if (options.profile)
            user.profile = options.profile;
        user.storyId = '';
        return user;
    });
}
if (Meteor.isClient) {
    Session.setDefault('storyId', -1);
    Accounts.onLogin(Spielebuch.subscribe);
    Meteor.startup(Spielebuch.subscribe);
}