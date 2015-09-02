class ORM {
    setFields(_id) {
        _.forEach(this.fields, function (field, key) {
            object[key] = field;
        });
        return object;
    }
};