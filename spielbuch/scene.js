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

class Scene extends Spielbuch.Base {
    constructor(userId, storyId, load) {
        super(userId, load);

        if (this.created) {
            this.onCreate(storyId);
        }
    }

    onCreate(storyId) {
        this.set('storyId', storyId);
    }

    getFields(userId) {
        return {
            'storyId': {
                type: String,
                default: 'global'
            },
            'userId': {
                type: String,
                default: userId
            },
            'text': {
                type: Array,
                default: []
            },
            'effects': {
                type: Array,
                default: []
            },
            onFirstVisit: {
                type: String,
                default: ''
            },
            onVisit: {
                type: String,
                default: ''
            },
            visited: {
                type: Boolean,
                default: false
            }
        };
    }

    getCollection() {
        return 'Scenes';
    }

    removeGameObject(_id) {
        var text = this.get('text');
        _.forEach(text, (textStack,textStackKey) => {
            _.forEach(textStack, (sentence,sentenceKey) => {
                if (typeof sentence === 'string') {
                    if (sentence.indexOf(_id) !== -1) {
                        return textStack.splice(sentenceKey, 1);
                    }
                }
            });
            if(textStack.length===0){
                text.splice(textStackKey, 1);
            }
        });
        this.set('text', text);
    }


    /**
     * Creates gameobjets from a text with markup.
     * Changes the markuped text, that the objectnames are replaced by the _ids of the created objects.
     * @param args [String]: Text with markdown, that will be searched for gameObjects
     * @returns {}|GameObject|{gameobjectKey:Gameobject}
     */
    addText() {
        if (Meteor.isServer) {
            var re = /\[([^\]]+)\]\(([^)]+)\)/, result = {}, textStack = [], gameObjectArray = [];
            _.forEach(arguments, (text) => {
                var regexResult = re.exec(text);
                if (regexResult !== null) {
                    var objectName = regexResult[1];
                    var objectKey = regexResult[2];
                    var gameObject = new Spielbuch.GameObject(objectName, objectKey, this.get('_id'), this.get('userId'),false);
                    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/, '[' + gameObject.get('_id') + ']');
                    gameObjectArray.push({key: objectKey, gameObject: gameObject});
                }
                textStack.push(text);
            });
            this.push('text', textStack);
            Spielbuch.log('Added text to scene ' + this._id + '.');
            if (gameObjectArray.length > 1) {
                _.forEach(gameObjectArray, (item)=> {
                    result[item.key] = item.gameObject;
                });
            } else if (gameObjectArray.length === 1) {
                result = gameObjectArray[0].gameObject;
            }
            return result;
        }
    }

    getText() {
        this.executeOnStart();
        return this.get('text');
    }

    onFirstVisit(fnc) {
        if (Meteor.isServer) {
            var fncId = Spielbuch.StoredFunction.save(fnc, this.get('userId'), this.get('_id'));
            this.set('onFirstVisit', fncId);
        }
    }

    onVisit(fnc) {
        if (Meteor.isServer) {
            var fncId = Spielbuch.StoredFunction.save(fnc, this.get('userId'));
            this.set('onVisit', fncId);
        }
    }

    executeOnStart() {
        if (Meteor.isClient) {
            var visited = this.get('visited');
            if (visited) {
                if(this.get('onVisit')){
                    Spielbuch.StoredFunction.execute(this.get('onVisit'));
                }
            }
            else {
                if(this.get('onFirstVisit')){
                    Spielbuch.StoredFunction.execute(this.get('onFirstVisit'));
                }
                this.set('visited', true);
            }
        }
    }
}

Spielbuch.Scene = Scene;
Spielbuch.Scenes = new Mongo.Collection('scenes');

