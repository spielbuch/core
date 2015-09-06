class Rule {
    constructor(key, value) {
        var self = this;
        check(key, String);
        if (typeof value === 'string' || typeof value === 'number') {
            self.key = key;
            self.value = value;
        } else {
            Spielebuch.error(500, 'The type of a rule value must be a string or a number.')
        }
    }

    /**
     * Returns the properties as JSON
     * @returns {{name: *, rules: Array}}
     */
    getJSON() {
        var self = this;
        return {key: self.key, value: self.value};
    }
}
Spielebuch.Rule = Rule;