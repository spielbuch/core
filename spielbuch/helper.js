/**
 * Created by Daniel Budick on 08 Sep 2015.
 * Copyright 2015 Daniel Budick All rights reserved.
 * Contact: daniel@budick.eu / http://budick.eu
 *
 * This file is part of spielbuch:core
 * spielbuch:core is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * spielbuch:core is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with spielbuch:core. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Contains some Functions that can be used when writing a story.
 * @type {{}}
 */
Spielbuch.helper = {};

Spielbuch.helper.getStoryById = function(storyId){
    return Spielbuch.Stories.findOne(storyId);
};



