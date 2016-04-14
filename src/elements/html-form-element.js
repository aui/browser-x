'use strict';

var url = require('url');
var HTMLElement = require('../html-element');

function HTMLFormElement(document, name, namespaceURI) {
    HTMLElement.call(this, document, name, namespaceURI);
}

HTMLFormElement.prototype = Object.create(HTMLElement.prototype, {
    action: {
        get: function() {
            var action = this.getAttribute('action');
            // TODO file://
            return url.resolve(this.baseURI, action);
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