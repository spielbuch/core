Spielebuch.log = function (msg) {
    if (Spielebuch.Settings.debug) {
            console.log(msg);
    }
};
Spielebuch.error = function (errorcode, msg) {
    if (Spielebuch.Settings.debug) {
        if(Meteor.isClient) {
            console.error(errorcode, msg);
        }
        if(Meteor.isServer){
            throw new Meteor.Error(errorcode, msg);
        }
    }
};