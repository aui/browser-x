'use strict';

var Node = require('./node');

function Attr(ownerDocument, name, specified, value) {
    Node.call(this, ownerDocument, name, value, Node.ATTRIBUTE_NODE);
    Object.defineProperties(this, {
        specified: {
            value: specified
        }
    });
}

Attr.prototype = Object.create(Node.prototype, {
    name: {
        get: function() {
            return this.nodeName;
        }
    },
    value: {
        get: function() {
            return this.nodeValue;
        }
    }
});

Attr.prototype.constructor = Attr;

module.exports = Attr;