'use strict';
var url = require('url');

var Element = require('../element');

function HTMLElement(document, name, namespaceURI) {
    Element.call(this, document, name, namespaceURI);
}

HTMLElement.prototype = Object.create(Element.prototype, {});
HTMLElement.prototype.constructor = HTMLElement;
module.exports = HTMLElement;