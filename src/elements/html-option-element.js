'use strict';

var HTMLElement = require('../html-element');

function HTMLOptionElement(document, name, namespaceURI) {
    HTMLElement.call(this, document, name, namespaceURI);
}

HTMLOptionElement.prototype = Object.create(HTMLElement.prototype, {
    index: {
        get: function() {
            var select = closest('SELECT');
            if (select) {
                return Array.prototype.indexOf.call(select.options, this);
            } else {
                return 0;
            }
        }
    },
    value: {
        get: function() {
            return this.hasAttribute('value') ? this.getAttribute('value') : this.innerHTML;
        }
    },
    selected: {
        // TODO 如果兄弟 option 标签也有 selected 属性，
        // 且 select 无 multiple 属性，则需要处理冲突
        get: function() {
            return this.hasAttribute('selected');
        }
    },
    defaultSelected: {
        get: function() {
            return this.selected;
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

HTMLOptionElement.prototype.constructor = HTMLOptionElement;

function closest(e, nodeName) {
    while (e) {
        if (e.nodeName === nodeName) {
            return e;
        }
        e = e.parentNode;
    }

    return null;
}

module.exports = HTMLOptionElement;