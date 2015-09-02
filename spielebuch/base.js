class BaseClass {
    constructor(collection, fields, _id, params) {
        var self = this;
        self.collection = collection;
        self.values = {};
        self.fields = fields;
        if (!_id) {
            self.onCreate(params);
            self.save();
        }
        else {
            self._id = _id;
            self.values = self.load(_id);
        }

        return self;
    }

    onCreate() {
        Spielebuch.ServerLog('onCreate was not implemented for ' + this.collection._name + '.');
    }


    load(_id) {
        return context.collection.findOne(_id);
    }

    save() {
        var self = this, success;
        _.forEach(self.values, function (value, key) {
            var field = self.fields[key];
            if (!field) {
                throw new Meteor.Error('500', 'Value ' + value + ' is not an allowed field.');
            }
            if (typeof field === 'object' && field !== null) {
                if (field.default && !value) {
                    self.values[key] = value;
                }
                check(value, field.type);
            } else {
                if (typeof value !== field) {
                    throw new Meteor.Error('500', 'Value ' + value + ' is not an ' + field + '.');
                }
            }
        });
        Spielebuch.ServerLog('Save following values:');
        Spielebuch.ServerLog(self.values);
        if (self._id) {
            success = self.collection.update(self._id, {$set: self.values});
            Spielebuch.ServerLog('Update was sucessfull: ' + !!success);
        } else {
            self._id = self.collection.insert(self.values);
            Spielebuch.ServerLog('Insert was sucessfull, _id: ' + self._id);
        }
    }

    get(key) {
        var self = this, data;
        if(key==='_id'){
            //we don't need this reactive, because the _id will never change.
            return self._id;
        }
        data = self.collection.findOne(self._id)
        if (!data) {
            Spielebuch.ServerLog('Object with _id ' + self._id + ' not found.');
            return undefined;
        }
        if (!key) {
            return data;
        }
        if (typeof key === 'string') {
            self.value[key] = data[key];
            return self.values[key];
        } else {
            Spielebuch.ServerLog('Key ' + key + 'is not a string.');
        }
    }

    set(key, value) {
        var self = this, update = {};
        self.values[key] = value;
        update[key] = value;
        self.collection.update(self._id, {$set: update});
    }
}
Base = BaseClass;