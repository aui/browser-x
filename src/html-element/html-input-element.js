'use strict';

var Element = require('../element');

function HTMLInputElement(document, name, namespaceURI) {
    Element.call(this, document, name, namespaceURI);
}

HTMLInputElement.prototype = Object.create(Element.prototype, {
    type: {
        get: function() {
            var type = this.getAttribute('type');
            return type || 'text';
        }
    },
    value: {
        get: function() {
            return this.getAttribute('value') || '';
        }
    },
    defaultValue: {
        get: function() {
            return this.value;
        }
    },
    checked: {
        get: function() {
            return this.hasAttribute('checked');
        }
    },
    defaultChecked: {
        get: function() {
            return this.checked;
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

HTMLInputElement.prototype.constructor = HTMLInputElement;

module.exports = HTMLInputElement;