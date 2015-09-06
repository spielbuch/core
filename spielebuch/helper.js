/**
 * Contains some Functions that can be used when writing a story.
 * @type {{}}
 */
Spielebuch.helper = {};

Spielebuch.helper.getStoryById = function(storyId){
    return Spielebuch.Stories.findOne(storyId);
};



