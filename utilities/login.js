if (Meteor.isServer) {
    Accounts.onCreateUser(function (options, user) {
        if (options.profile)
            user.profile = options.profile;
        user.storyId = '';
        return user;
    });
}
