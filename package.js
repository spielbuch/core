/**
 * Created by Daniel Budick on 08 Sep 2015.
 * Copyright 2015 Daniel Budick All rights reserved.
 * Contact: daniel@budick.eu / http://budick.eu
 *
 * This file is part of spielebuch:core
 * spielebuch:core is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * spielebuch:core is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with spielebuch:core. If not, see <http://www.gnu.org/licenses/>.
 */

Package.describe({
    name: 'spielebuch:core',
    summary: 'A framework to create interactive stories.',
    documentation: 'readme.md',
    git: 'https://github.com/spielebuch/core',
    version: '0.0.6'
});

Package.onUse(function (api) {
    api.versionsFrom('1.2');

    api.use([
        'meteor-base',
        'mongo',
        'check',
        'session',
        'ecmascript',
        'es5-shim',
        'accounts-base',
        'reactive-var',
        'risul:chance@1.0.7_1'
    ]);

    api.imply([
        'es5-shim',
        'accounts-base'
    ]);



    api.addFiles('spielebuch.js', ['server', 'client']);
    api.addFiles('utilities/calculator.js', ['server', 'client']);
    api.addFiles('utilities/startup.js', ['server', 'client']);

    /**
     * Add function to log events
     */
    api.addFiles('utilities/log.js', ['server', 'client']);

    /**
     * Add timer to use on the client
     */
    api.addFiles('utilities/timer.js','client');


    /**
     * Adding objects
     */
    api.addFiles('spielebuch/base.js', ['server', 'client']);
    api.addFiles('spielebuch/effect.js', ['server', 'client']);

    api.addFiles('spielebuch/gameobject.js', ['server', 'client']);
    api.addFiles('spielebuch/scene.js', ['server', 'client']);
    api.addFiles('spielebuch/story.js', ['server', 'client']);


    api.addFiles('spielebuch/rule.js', ['server', 'client']);

    api.addFiles('spielebuch/player.js', ['server', 'client']);
    api.addFiles('spielebuch/helper.js', ['server', 'client']);


    /**
     * With this class functions are stored as a string in the database.
     * The client should only have read access.
     * If Malory can manipulate these, he can execute javascript on the clients browser.
     * This would be very awkward, so stored_function can inserted, updated or removed by the server.
     *
     * Every user should be able to read every function stored in here,
     * they are executed on their system, so transparency is imho necessary.
     */
    api.addFiles('spielebuch/stored_functions.js', ['server', 'client']);

    /**
     * Permissions for collections
     */
    api.addFiles('utilities/permissions.js', 'server');

    /**
     * Methods
     */
    api.addFiles('utilities/methods.js', 'server');

    /**
     * Publications
     */
    api.addFiles('utilities/publications.js', 'server');

    /**
     * Strings that can be overwritten by language packages
     */
    api.addFiles('utilities/language.js', ['server', 'client']);


    if (api.export) {
        api.export('Spielebuch');
    }
});

Package.onTest(function(api) {
    api.use([
        'risul:chance',
        'spielebuch:core',
        'tinytest',
        'test-helpers',
        'underscore'
    ]);
    api.addFiles('test-server.js', 'server');
});