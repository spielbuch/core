Spielebuch.StoredFunctions = new Mongo.Collection('storedFunctions');


/**
 * The following code forbids the client to insert, update or remove anythign in this collection.
 * This is high risk code, don't change it if you aren't absolutly sure what you are doing.
 *
 * You still want to change something?
 * You have been warned. Read the docs, to make sure that you know what you are doing.
 */
if(Meter.isServer){
    Spielebuch.StoredFunctions.deny({
        insert: function(){
            return false;
        },
        update:
        function(){
            return false;
        },
        remove: function(){
            return false;
        }
    });

    /**
     * Publish the whole collection to the user for transparency.
     * These function can be executed on the user, so they have a right to know, before something goes wrong.
     */
    Spielebuch.StoredFunctions.publish('allStoredFunctions', function(){
        return Spielebuch.StoredFunctions.find();
    });

    Spielebuch.createFunctionString = function(fnc){

    };
}
