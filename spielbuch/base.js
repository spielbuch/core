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

class BaseClass {
    /**
     * If a story is written, it always happens on the server.
     * This means, if we call new Object(), we want the Object to be created on the database.
     * If we call new Object from the client, we always want to load the object, because the client cannot insert new objects.
     * @returns {boolean} Returns true when onCreate should be called in the subclass.
     */
    constructor(userId, load) {
        /**
         * Check if userId is set on the server. On the client it is set automatically when user is loggedin
         */
        if(!userId && Meteor.isClient){
            if(Meteor.userId()){
                userId = Meteor.userId();
            }else{
                Spielbuch.error(403, 'You cannot create an object in ' + this.getCollection() + ' without beeing loggedin.');
            }
        }else if(!userId && Meteor.isServer){
            Spielbuch.error(500, 'You cannot create an object in ' + this.getCollection() + ' without supplying an userId.');
        }


        if (!load && Meteor.isServer) {
            this._id = this.setDefault(userId);
            Spielbuch.log('New Object in ' + this.getCollection() + ' was created. The _id is ' + this._id + '.');
            this.created = true; //this decides if the child-object calls its onCreate-Method
        }else{
            this.created = false;
        }
    }

    getFields() {
        Spielbuch.log('There are no fields implemented for ' + this.constructor.name + '.');
    }

    getCollection() {
        Spielbuch.log('There is no collection defined for ' + this.constructor.name + '.');
    };

    load(_id) {
        var count = Spielbuch[this.getCollection()].find({_id: _id}, {_id: 1, limit: 1}).count();
        if (count === 0) {
            Spielbuch.error(404, 'Object with _id ' + _id + ' was not found in ' + this.getCollection() + '.');
            return false;
        }
        this._id = _id;
        return true;
    }

    onCreate() {
        Spielbuch.log('onCreate was not implemented for ' + this.getCollection() + '.');
    }

    /**
     * Sets default values for the values of this object.
     */
    setDefault(userId) {
        var insert = {};
        _.forEach(this.getFields(userId), function (field, key) {
            if (field.default) {
                insert[key] = field.default;
            }
        });
        return this.set(insert);
    }

    validate(key, value) {
        var data, field;
        if (typeof key === 'string' && value) {
            field = this.getFields()[key];
            if (!field) {
                Spielbuch.error(500, 'The Field ' + key + ' is not defined.');
            }
            if (field.type) {
                check(value, field.type);
            } else {
                check(value, field)
            }
        } else if (key && !value) {
            data = key;
            _.forEach(data, function (fieldValue, fieldKey) {
                if (fieldKey !== '_id') {
                    return;
                }
                field = this.getFields()[fieldKey];
                if (!field) {
                    Spielbuch.error(500, 'The Field ' + key + ' is not defined.');
                }
                if (field.default && !data[fieldKey]) {
                    data[fieldKey] = field.default;
                }
                if (field.type) {
                    check(fieldValue, field.type);
                } else {
                    check(fieldValue, field)
                }
            });
        } else {
            /**
             * key is no string, but a value exist. This should not happen.
             */
            Spielbuch.error(500, 'The update went wrong. Base.validate() was misused.');
        }
    }


    get(key) {
        var data;
        if (key === '_id') {
            //we don't need this reactive, because the _id will never change.
            return this._id;
        }
        data = Spielbuch[this.getCollection()].findOne(this._id);
        if (!data) {
            Spielbuch.log('Object with _id ' + this._id + ' not found in ' + this.getCollection() + '.');
            return undefined;
        }
        if (!key) {
            return data;
        }
        if (typeof key === 'string') {
            return data[key];
        } else {
            Spielbuch.log('Key ' + key + 'is not a string.');
        }
    }

    set(key, value) {
        var update = {};
        if (typeof key === 'string' && value) {
            this.validate(key, value);
            update[key] = value;
        } else if (!value && typeof key==='object') {
            /**
             * If there is no value and
             */
            update = key;
            this.validate(key);
        } else {
            /**
             * key is no string, but a value exist. This should not happen.
             */
            Spielbuch.error('500', 'The update went wrong. Base.set() was misused.');
            return;
        }
        if (this._id) {
            return Spielbuch[this.getCollection()].update(this._id, {$set: update});
        } else {
            return Spielbuch[this.getCollection()].insert(update);
        }
    }

    setInObject(objectKey, key, value){
        check(objectKey,String);
        check(key, String);
        var doc = Spielbuch[this.getCollection()].findOne(this._id);
        doc[objectKey][key] = value;
        Spielbuch[this.getCollection()].update(this._id, doc);
    }

    /**
     * Does only work with arrays
     * @param key
     * @param value
     */
    push(key, value) {
        var update = {};
        update[key] = value;
        return Spielbuch[this.getCollection()].update(this._id, {
            $push: update
        });
    }

    /**
     * Does only work with arrays.
     * Returns last item of array.
     * @param key
     */
    last(key) {
        return _.last(this.get(key));
    }
}
Spielbuch.Base = BaseClass;