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

Meteor.publish('userStory', function () {
    var userOrGlobal = {
        $or: [{userId: this.userId}, {userId: 'global'}]
    };
    return [
        Meteor.users.find({_id: this.userId},
            {fields: {storyId: 1}}),
        Spielebuch.Stories.find(userOrGlobal, {
            fields: {scenes: 1, history: 1, userId: 1}
        }),
        Spielebuch.Scenes.find(userOrGlobal, {
            fields: {effects: 1, onFirstVisit: 1, storyId: 1, text: 1, userId: 1, onVisit: 1, visited: 1}
        }),
        Spielebuch.GameObjects.find(userOrGlobal, {
            fields: {effects: 1, events: 1, name: 1, overrides: 1, userId: 1, referenceId: 1,afterDestruction: 1, equipmentTarget: 1, equipmentRules:1}
        }),
        Spielebuch.StoredFunctions.find(userOrGlobal, {
            fields: {fncString: 1, userId: 1}
        }),
        Spielebuch.Players.find(userOrGlobal, {
            fields: {afterDestruction: 1, userId: 1, effects: 1, name: 1,backpack: 1, body: 1}
        })
    ];
});