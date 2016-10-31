/**
 * Created by Daniel Budick on 08 Sep 2015.
 * Copyright 2015 Daniel Budick All rights reserved.
 * Contact: daniel@budick.eu / http://budick.eu
 *
 * This file is part of spielbuch-core
 * spielbuch-core is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * spielbuch-core is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with spielbuch-core. If not, see <http://www.gnu.org/licenses/>.
 */


/**
 * User can update their own stuff, or that belongs to global
 */
var ownStuff = {
    update: function(userId, doc){
        return doc.userId === userId;
    },
    remove: function(userId, doc){
        return doc.userId === userId;
    },
    fetch: ['userId']
};

Spielbuch.Stories.allow(ownStuff);
Spielbuch.Scenes.allow(ownStuff);
Spielbuch.GameObjects.allow(ownStuff);
Spielbuch.Players.allow(ownStuff);