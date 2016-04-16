'use strict';

var HTMLElement = require('../html-element');

function HTMLUnknownElement(document, name, namespaceURI) {
    HTMLElement.call(this, document, name, namespaceURI);
}

HTMLUnknownElement.prototype = Object.create(HTMLElement.prototype, {});
HTMLUnknownElement.prototype.constructor = HTMLUnknownElement;

module.exports = HTMLUnknownElement;