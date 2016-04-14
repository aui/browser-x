'use strict';

var url = require('url');
var HTMLElement = require('../html-element');

function HTMLAnchorElement(document, name, namespaceURI) {
    HTMLElement.call(this, document, name, namespaceURI);
}

HTMLAnchorElement.prototype = Object.create(HTMLElement.prototype, {
    href: {
        get: function() {
            var href = this.getAttribute('href');
            // TODO file://
            return url.resolve(this.baseURI, href);
        }
    }
});

HTMLAnchorElement.prototype.constructor = HTMLAnchorElement;

module.exports = HTMLAnchorElement;