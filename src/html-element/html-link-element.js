'use strict';

var url = require('url');
var Element = require('../element');


function HTMLLinkElement(document, name, namespaceURI) {
    Element.call(this, document, name, namespaceURI);
}

HTMLLinkElement.prototype = Object.create(Element.prototype, {
    href: {
        get: function() {
            var href = this.getAttribute('href');
            // TODO file://
            return url.resolve(this.ownerDocument.baseURI, href);
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