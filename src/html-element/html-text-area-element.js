'use strict';

var Element = require('../element');

function HTMLTextAreaElement(document, name, namespaceURI) {
    Element.call(this, document, name, namespaceURI);
}

HTMLTextAreaElement.prototype = Object.create(Element.prototype, {
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
