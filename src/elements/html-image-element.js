'use strict';

var url = require('url');
var HTMLElement = require('../html-element');

function HTMLImageElement(document, name, namespaceURI) {
    HTMLElement.call(this, document, name, namespaceURI);
}

HTMLImageElement.prototype = Object.create(HTMLElement.prototype, {
    src: {
        get: function() {
            var src = this.getAttribute('src');
            // TODO file://
            return url.resolve(this.baseURI, src);
        }
    }
});

HTMLImageElement.prototype.constructor = HTMLImageElement;

module.exports = HTMLImageElement;