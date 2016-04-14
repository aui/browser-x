'use strict';

var HTMLElement = require('../html-element');

function HTMLTextAreaElement(document, name, namespaceURI) {
    HTMLElement.call(this, document, name, namespaceURI);
}

HTMLTextAreaElement.prototype = Object.create(HTMLElement.prototype, {
    type: {
        get: function() {
            return 'textarea';
        }
    },
    value: {
        get: function() {
            return this.textContent;
        }
    },
    defaultValue: {
        get: function() {
            return this.value;
        }
    },
    disabled: {
        get: function() {
            return this.hasAttribute('disabled');
        }
    },
    form: {
        get: function() {
            var e = this;
            while (e) {
                if (e.nodeName === 'FORM') {
                    return e;
                }
                e = e.parentNode;
            }

            return null;
        }
    }
});

HTMLTextAreaElement.prototype.constructor = HTMLTextAreaElement;

module.exports = HTMLTextAreaElement;