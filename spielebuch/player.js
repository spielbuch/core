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
        super(userId);
        var self = this;
        if(self.created){
            self.onCreate();
        }else{
            var doc = Spielebuch.Players.findOne({userId:userId});
            self._id = doc._id;
        }
    }



    onCreate(){

    }

    /**
     * Creates an damage effect with the stats of the player.
     */
    attack(method,target,name){
        if(!name){
            name = 'Damage';
        }
        return new Spielebuch.Effect(name,[new Spielebuch.Rule('Damage','-200')]);
    }

    addEffect(effect){
        return super.addEffect(effect);
    }

    getBackpackList(){
        var self = this;
        return Spielebuch.Gameobject.find({referenceId: self.get('userId')});
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


    getFields(userId){
        return {
            'name': {
                type: String,
                default: 'Noname'
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

    getCollection(){
        return 'Players';
    }
}
Spielebuch.Player = Player;
Spielebuch.Players = new Mongo.Collection('players');