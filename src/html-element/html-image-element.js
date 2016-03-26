'use strict';

var url = require('url');
var Element = require('../element');

function HTMLImageElement(document, name, namespaceURI) {
    Element.call(this, document, name, namespaceURI);
}

HTMLImageElement.prototype = Object.create(Element.prototype, {
    src: {
        get: function() {
            var src = this.getAttribute('src');
            // TODO file://
            return url.resolve(this.ownerDocument.baseURI, src);
        }
    }
});

HTMLImageElement.prototype.constructor = HTMLImageElement;

module.exports = HTMLImageElement;