# Spielbuch:Core
This is a framework to create interactive stories. 
A story is written with a few simple and easy to understand JavaScript-Functions.

# Install
- If you speak German, click [here](https://github.com/spielbuch/example-de) if you speak English click [here](https://github.com/spielbuch/example-en)


# Install from scratch
- install [Meteor](https://meteor.com)
- create an app
- install the core package with `meteor add package spielbuch:core`
- install an ui package, e.g. `meteor add package spielbuch:ui`
- include the following template on the client:
`<template name="storyPage">
    <div class="col-md-12">
        {{>readerText}}
        {{>readerInteraction}}
        {{>readerCountdown}}
        <hr/>
        {{>readerLog}}
    </div>
</template>`
- create a story on the server for each user
(don't worry I will make a tutorial soon)

#Documentation
This is still work in progress. The API can change and a documentation will be written. 
For an example application go to: 
- https://github.com/spielbuch/example-en (English)
- https://github.com/spielbuch/example-de (German)

To see the application in action visit:
http://spielbuch.meteor.com/ (german)

If you have ideas or find bugs, feel free to create an [issue](https://github.com/spielbuch/core/issues).


# License
This package is published under the GNU Affero General Public License in the hope that it will be helpful.
For commercial use outside the GNU Affero General Public License contact spielbuch@budick.eu
