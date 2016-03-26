'use strict';

var url = require('url');
var Element = require('../element');

function HTMLFormElement(document, name, namespaceURI) {
    Element.call(this, document, name, namespaceURI);
}

HTMLFormElement.prototype = Object.create(Element.prototype, {
    action: {
        get: function() {
            var action = this.getAttribute('action');
            // TODO file://
            return url.resolve(this.ownerDocument.baseURI, action);
        }
    },
    enctype: {
        get: function() {
            return this.getAttribute('enctype') || 'application/x-www-form-urlencoded';
        }
    },
    method: {
        get: function() {
            return (this.getAttribute('method') || 'get').toLowerCase();
        }
    },
    target: {
        get: function() {
            return this.getAttribute('target') || '';
        }
    }
});

HTMLFormElement.prototype.constructor = HTMLFormElement;

module.exports = HTMLFormElement;