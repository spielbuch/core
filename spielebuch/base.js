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
            self.values = self.getValues(self);
        }

        return self;
    }

    onCreate() {
        Spielebuch.ServerLog('onCreate was not implemented for');
    }


    getValues(context) {
        return context.collection.findOne(context._id);
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
        } else {
            success = self.collection.insert(self.values);
        }
        Spielebuch.ServerLog('Save was sucessfull: '+!!success);
    }

    get(key) {
        var self = this, data = self.collection.findOne(self._id);
        if(!data){
            Spielebuch.ServerLog('Object with _id ' + self._id + 'not found.');
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