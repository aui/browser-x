'use strict';

var url = require('url');
var Element = require('../element');


function HTMLAnchorElement(document, name, namespaceURI) {
    Element.call(this, document, name, namespaceURI);
}

HTMLAnchorElement.prototype = Object.create(Element.prototype, {
    href: {
        get: function() {
            var href = this.getAttribute('href');
            // TODO file://
            return url.resolve(this.ownerDocument.baseURI, href);
        }
    }
});


HTMLAnchorElement.prototype.constructor = HTMLAnchorElement;
module.exports = HTMLAnchorElement;