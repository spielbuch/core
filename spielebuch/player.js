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

class Player extends Spielebuch.HasEffects {
    constructor(userId) {
        super(userId);
        var self = this;
        if (self.created) {
            self.onCreate();
        } else {
            var doc = Spielebuch.Players.findOne({userId: userId});
            if (doc) {
                self._id = doc._id;
            }
        }
    }


    onCreate() {

    }

    addEffect(effect) {
        return super.addEffect(effect);
    }

    getBackpackList() {
        var self = this;
        return Spielebuch.GameObjects.find({referenceId: self.get('userId')}).fetch();
    }

    destroy() {
        var self = this;
        Spielebuch.print('destroyedObject', self.get('name'));
        super.destroy();
    }

    afterDestruction(fnc) {
        var self = this, fncId = super.afterDestruction(fnc);
        self.set('afterDestruction', fncId);
    }


    getFields(userId) {
        return {
            'name': {
                type: String,
                default: chance.name()
            },
            'userId': {
                type: String,
                default: userId
            },
            'effects': {
                type: Array,
                default: []
            },
            'afterDestruction': {
                type: String,
                default: ''
            },
            backpack: {
                type: Array,
                default: []
            }
        };
    }

    getCollection() {
        return 'Players';
    }
}
Spielebuch.Player = Player;
Spielebuch.Players = new Mongo.Collection('players');