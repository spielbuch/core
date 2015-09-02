Package.describe({
    name: 'spielebuch:core',
    summary: '',
    git: 'https://github.com/spielebuch/core',
    version: '0.0.1'
});

Package.onUse(function (api) {
    api.versionsFrom('1.0');

    api.use([
        'meteor-platform',
        'underscore',
        'accounts-base',
        'jagi:astronomy'
    ]);

    api.imply([
        'meteor-platform',
        'underscore',
        'accounts-base'
    ]);



    api.addFiles('spielebuch.js', ['server', 'client']);

    /**
     * Add function to log events on serverside
     */
    api.addFiles('utilities/server_log.js', ['server', 'client']);


    /**
     * A small ORM to map JS-Classes to MongoDB-Docs
     */
    api.addFiles('utilities/orm.js', ['server', 'client']);

    /**
     * Adding objects
     */
    api.addFiles('spielebuch/gameobject.js', ['server', 'client']);
    api.addFiles('spielebuch/scene.js', ['server', 'client']);
    api.addFiles('spielebuch/story.js', ['server', 'client']);
    api.addFiles('spielebuch/player.js', 'client'); //works only on client for now
    api.addFiles('spielebuch/helper.js', ['server', 'client']);

    /**
     * Permissions for collections
     */
    api.addFiles('utilities/permissions.js', 'server');

    /**
     * Manipulating user creation
     */
    api.addFiles('utilities/login.js', 'server');
    /**
     * Methods
     */
    api.addFiles('utilities/methods.js', 'server');

    /**
     * Publications
     */
    api.addFiles('utilities/publications.js', 'server');

    /**
     * Subscriptions (for data that is always needed)
     */
    api.addFiles('utilities/subscriptions.js', 'client');



    if (api.export) {
        api.export('Spielebuch');
    }
});

Package.onTest(function(api) {
    api.use('tinytest');
    api.addFiles('tests.js', ['server']);
});