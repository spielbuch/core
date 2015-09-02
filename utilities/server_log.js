Spielebuch.ServerLog = function(msg){
    if(Spielebuch.Settings.debug && Meteor.isServer){
        console.log(msg);
    }
};