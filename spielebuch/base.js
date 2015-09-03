class BaseClass {
    constructor(collection, fields, _id, params) {
        var self = this;
        self.collection = collection;
        self.fields = fields;
        if (!_id) {
            self._id = self.setDefault();
            Spielebuch.ServerLog('New Object in ' + collection + ' was created. The _id is ' + self._id + '.');
            self.onCreate(params);
        }
        else {
            self._id = _id;
        }

        return self;
    }

    onCreate() {
        var self = this;
        Spielebuch.ServerLog('onCreate was not implemented for ' + self.collection + '.');
    }

    /**
     * Sets default values for the values of this object.
     */
    setDefault() {
        var self = this, insert = {};
        _.forEach(self.fields, function (field, key) {
            if (field.default) {
                insert[key] = field.default;
            } else {
                insert[key] = field();
            }
        });
        return self.set(insert);
    }

    validate(key, value) {
        var self = this, data, field;
        if (typeof key === 'string' && value) {
            field = self.fields[key];
            if (!field) {
                throw new Meteor.Error('500', 'The Field ' + key + ' is not defined.');
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
                field = self.fields[fieldKey];
                if (!field) {
                    throw new Meteor.Error('500', 'The Field ' + key + ' is not defined.');
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
            throw new Meteor.Error('500', 'The update went wrong. Base.validate() was misused.');
        }
    }


    get(key) {
        var self = this, data;
        if (key === '_id') {
            //we don't need this reactive, because the _id will never change.
            return self._id;
        }
        data = Spielebuch[self.collection].findOne(self._id);
        if (!data) {
            Spielebuch.ServerLog('Object with _id ' + self._id + ' not found.');
            return undefined;
        }
        if (!key) {
            return data;
        }
        if (typeof key === 'string') {
            return data[key];
        } else {
            Spielebuch.ServerLog('Key ' + key + 'is not a string.');
        }
    }

    set(key, value) {
        var self = this, update = {};
        if (typeof key === 'string' && value) {
            self.validate(key, value);
            update[key] = value;
        } else if (!value) {
            /**
             * If there is no value and
             */
            update = key;
            self.validate(key);
        } else {
            /**
             * key is no string, but a value exist. This should not happen.
             */
            throw new Meteor.Error('500', 'The update went wrong. Base.set() was misused.');
        }
        if (self._id) {
            return Spielebuch[self.collection].update(self._id, {$set: update});
        } else {
            return Spielebuch[self.collection].insert(update);
        }
    }

    /**
     * Does only work with arrays
     * @param key
     * @param value
     */
    push(key, value) {
        var self = this, update = {};
        update[key] = value;
        return Spielebuch[self.collection].update(self._id, {
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
Base = BaseClass;