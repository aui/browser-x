'use strict';

var CSSStyleDeclaration = require('../style').CSSStyleDeclaration;
var Element = require('../element');

function HTMLSelectElement(document, name, namespaceURI) {
    Element.call(this, document, name, namespaceURI);
}

HTMLSelectElement.prototype = Object.create(Element.prototype, {
    lang: {
        get: function() {
            return this.getAttribute('lang') || '';
        }
    },
    style: {
        get: function() {
            if (this._style) {
                return this._style;
            } else {
                var style = this._style = new CSSStyleDeclaration();
                var cssText = this.getAttribute('style');

                if (cssText) {
                    style.cssText = cssText;
                }

                return this._style;
            }
        }
    },
    options: {
        // TODO HTMLOptionsCollection
        get: function() {
            return this.querySelectorAll('option');
        }
    },
    multiple: {
        get: function() {
            return this.hasAttribute('multiple');
        }
    },
    type: {
        get: function() {
            return this.multiple ? 'select-multiple' : 'select-one';
        }
    },
    selectedIndex: {
        get: function() {
            return Array.prototype.reduceRight.call(this.options, function(prev, option, i) {
                return option.selected ? i : prev;
            }, -1);
        }
    },
    length: {
        get: function() {
            return this.options.length;
        }
    },
    value: {
        get: function() {
            var i = this.selectedIndex;
            if (this.options.length && (i === -1)) {
                i = 0;
            }
            if (i === -1) {
                return '';
            }
            return this.options[i].value;
        }
    },
    disabled: {
        get: function() {
            return this.hasAttribute('disabled');
        }
    },
    form: {
        get: function() {
            return closest('FORM');
        }
    }
});

HTMLSelectElement.prototype.constructor = HTMLSelectElement;


function closest(e, nodeName) {
    while (e) {
        if (e.nodeName === nodeName) {
            return e;
        }
        e = e.parentNode;
    }

    return null;
}


module.exports = HTMLSelectElement;