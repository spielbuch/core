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

observeStory = function (storyId) {
    var queryUser = Meteor.users.find({_id: Meteor.userId()});
    queryUser.observeChanges({
        changed: function(_id, fields){
            if(Meteor.user().storyId) {
                Session.set('storyId', Meteor.user().storyId);
            }else{
                Session.set('storyId', -1);
            }
        }
    });

    var queryStory = Spielebuch.Stories.find({_id: Session.get('storyId')});
    queryStory.observeChanges({
        changed: function(_id, fields){
            console.log(fields);
        }
    });
    var queryScene = Spielebuch.Scenes.find({storyId: Session.get('playingSceneId')});
    queryScene.observeChanges({
        changed: function(_id, fields) {
            Session.set('playingSceneId', _.last(Spielebuch.Stories.findOne(Meteor.user().storyId).history));
            console.log(fields);
        }
    });
}