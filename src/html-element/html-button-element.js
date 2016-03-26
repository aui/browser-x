'use strict';

var Element = require('../element');

function HTMLButtonElement(document, name, namespaceURI) {
    Element.call(this, document, name, namespaceURI);
}

HTMLButtonElement.prototype = Object.create(Element.prototype, {
    type: {
        get: function() {
            var type = this.getAttribute('type');
            return type || 'submit';
        }
    },
    value: {
        get: function() {
            return this.getAttribute('value') || '';
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

HTMLButtonElement.prototype.constructor = HTMLButtonElement;

module.exports = HTMLButtonElement;