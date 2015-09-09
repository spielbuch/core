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

class Gameobject extends Spielebuch.HasEffects {
    constructor(objectname, referenceId, userId) {
        super();
        var self = this;
        if(self.created){
            self.onCreate(objectname, referenceId, userId);
        }
    }

    onCreate(objectname, referenceId, userId) {
        var self = this;
        Spielebuch.log('New Gameobject was created.');
        self.set('name', objectname);
        self.set('referenceId', referenceId);
        self.set('userId', userId);
    }

    setEvent(name, fnc, icon){
        var self = this;
        if(Meteor.isServer){
            var fncId = Spielebuch.StoredFunction.save(fnc, self.get('userId'), self.get('_id'));
            if(fncId){
                self.push('events', {
                    name: name,
                    fncId: fncId,
                    icon: icon
                });
            }
        }else{
            Spielebuch.error(500, 'The client is not allowed to set an event, for it would be madness!');
        }
    }

    /**
     * Implements the addEffect method of Spielebuch.HasEffects
     * @returns {*}
     */
    addEffect(effect){
    return super.addEffect(effect);
}

    getEvents(){
        var self = this;
        return self.get('events');
    }

    destroy(){
        var self = this;

        var scene = new Spielebuch.Scene();
        var res = scene.load(self.get('referenceId'));
        if(res){
            scene.removeGameobject(self.get('_id'))
        }
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
                default: 'Unnamed Object'
            },
            'referenceId': {
                type: String,
                default: 'global'
            },
            'userId': {
                type: String,
                default: 'global'
            },
            'effects': {
                type: Array,
                default: []
            },
            'events': {
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
        return 'Gameobjects';
    }
}
Spielebuch.Gameobject = Gameobject;
Spielebuch.Gameobjects = new Mongo.Collection('gameobjects');