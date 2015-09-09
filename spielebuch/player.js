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
    constructor(userId){
        super();
        var self = this;
        this.userId = userId;
        var doc = Spielebuch.Players.findOne({userId:userId});

    }

    /**
     * Creates an damage effect with the stats of the player.
     */
    attack(){

    }

    addEffect(effect){
        return super.addEffect(effect);
    }

    destroy(){
        var self = this;
        Spielebuch.StoredFunction.execute(self.get('afterDestruction'), self.get('userId'), self.get('_id'));
        Spielebuch.Gameobjects.remove(self.get('_id'));
    }

    afterDestruction(fnc){
        var self = this;
        if(Meteor.isServer){
            var fncId = Spielebuch.StoredFunction.save(fnc, self.get('userId'), self.get('_id'));
            if(fncId){
                self.set('afterDestruction', fncId);
            }
        }else{
            Spielebuch.error(500, 'The client is not allowed to set an event, for it would be madness!');
        }
    }


    getFields(){
        return {
            'name': {
                type: String,
                default: 'Noname'
            },
            'userId': {
                type: String,
                default: ''
            },
            'effects': {
                type: Array,
                default: []
            },
            'afterDestruction': {
                type: String,
                default: ''
            }
        };
    }
    getCollection(){
        return 'Players';
    }
}
Spielebuch.Player = Player;
Spielebuch.Players = new Mongo.Collection('players');