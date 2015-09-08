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

class BaseClass {
    /**
     * If a story is written, it always happens on the server.
     * This means, if we call new Object(), we want the Object to be created on the database.
     * If we call new Object from the client, we always want to load the object, because the client cannot insert new objects.
     * @returns {boolean} Returns true when onCreate should be called in the subclass.
     */
    constructor() {
        var self = this;
        if (Meteor.isServer) {
            self._id = self.setDefault();
            Spielebuch.log('New Object in ' + self.getCollection() + ' was created. The _id is ' + self._id + '.');
            self.created = true;
        }else{
            self.created = false;
        }
    }

    getFields() {
        Spielebuch.log('There are no fields implemented for ' + self.constructor.name + '.');
    }

    getCollection() {
        Spielebuch.log('There is no collection defined for ' + self.constructor.name + '.');
    }

;

    load(_id) {
        var self = this;
        var count = Spielebuch[self.getCollection()].find({_id: _id}, {_id: 1, limit: 1}).count();
        if (count === 0) {
            Spielebuch.error(404, 'Object with _id ' + _id + ' was not found in ' + self.getCollection() + '.');
            return false;
        }
        self._id = _id;
        return true;
    }

    onCreate() {
        var self = this;
        Spielebuch.log('onCreate was not implemented for ' + self.getCollection() + '.');
    }

    /**
     * Sets default values for the values of this object.
     */
    setDefault() {
        var self = this, insert = {};
        _.forEach(self.getFields(), function (field, key) {
            if (field.default) {
                insert[key] = field.default;
            }
        });
        return self.set(insert);
    }

    validate(key, value) {
        var self = this, data, field;
        if (typeof key === 'string' && value) {
            field = self.getFields()[key];
            if (!field) {
                Spielebuch.error(500, 'The Field ' + key + ' is not defined.');
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
                field = self.getFields()[fieldKey];
                if (!field) {
                    Spielebuch.error(500, 'The Field ' + key + ' is not defined.');
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
            Spielebuch.error(500, 'The update went wrong. Base.validate() was misused.');
        }
    }


    get(key) {
        var self = this, data;
        if (key === '_id') {
            //we don't need this reactive, because the _id will never change.
            return self._id;
        }
        data = Spielebuch[self.getCollection()].findOne(self._id);
        if (!data) {
            Spielebuch.log('Object with _id ' + self._id + ' not found in ' + self.getCollection() + '.');
            return undefined;
        }
        if (!key) {
            return data;
        }
        if (typeof key === 'string') {
            return data[key];
        } else {
            Spielebuch.log('Key ' + key + 'is not a string.');
        }
    }

    set(key, value) {
        var self = this, update = {};
        if (typeof key === 'string' && value) {
            self.validate(key, value);
            update[key] = value;
        } else if (!value && typeof key==='object') {
            /**
             * If there is no value and
             */
            update = key;
            self.validate(key);
        } else {
            /**
             * key is no string, but a value exist. This should not happen.
             */
            Spielebuch.error('500', 'The update went wrong. Base.set() was misused.');
        }
        if (self._id) {
            return Spielebuch[self.getCollection()].update(self._id, {$set: update});
        } else {
            return Spielebuch[self.getCollection()].insert(update);
        }
    }

    setInObject(objectKey, key, value){
        check(objectKey,String);
        check(key, String);
        var self = this, doc = Spielebuch[self.getCollection()].findOne(self._id);
        doc[objectKey][key] = value;
        Spielebuch[self.getCollection()].update(self._id, doc);
    }

    /**
     * Does only work with arrays
     * @param key
     * @param value
     */
    push(key, value) {
        var self = this, update = {};
        update[key] = value;
        return Spielebuch[self.getCollection()].update(self._id, {
            $push: update
        });
    }

    /**
     * Does only work with arrays.
     * Returns last item of array.
     * @param key
     */
    last(key) {
        var self = this;
        return _.last(self.get(key));
    }
}
Spielebuch.Base = BaseClass;