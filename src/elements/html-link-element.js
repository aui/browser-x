'use strict';

var url = require('url');
var HTMLElement = require('../html-element');

function HTMLLinkElement(document, name, namespaceURI) {
    HTMLElement.call(this, document, name, namespaceURI);
}

HTMLLinkElement.prototype = Object.create(HTMLElement.prototype, {
    href: {
        get: function() {
            var href = this.getAttribute('href');
            // TODO file://
            return url.resolve(this.baseURI, href);
        }
    },
    disabled: {
        get: function() {
            return this.hasAttribute('disabled');
        }
    }
});

HTMLLinkElement.prototype.constructor = HTMLLinkElement;

module.exports = HTMLLinkElement;