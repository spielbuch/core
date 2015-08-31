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
        'ecmascript',
        'jagi:astronomy'
    ]);

    api.imply([
        'meteor-platform',
        'underscore',
        'accounts-base',
        'ecmascript',
        'jagi:astronomy'
    ]);

    api.addFiles('spielebuch.js', ['server', 'client']);


    /**
     * Adding objects
     */
    api.addFiles('gamebook/gameobject.js', ['server', 'client']);
    api.addFiles('gamebook/scene.js', ['server', 'client']);
    api.addFiles('gamebook/story.js', ['server', 'client']);
    api.addFiles('gamebook/helper.js', ['server', 'client']);


    /**
     * Methods
     */
    api.addFiles('methods.js', 'server');


    if (api.export) {
        api.export('Spielebuch');
    }
});

Package.onTest(function(api) {
    api.use('tinytest');
    api.addFiles('tests.js', ['server']);
});