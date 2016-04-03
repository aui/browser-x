'use strict';

var DOMException = require('./dom-exception');
var NodeList = require('./node-list');
var NamedNodeMap = require('./named-node-map');

function Node(ownerDocument, nodeName, nodeValue, nodeType) {
    Object.defineProperties(this, {
        _parent: {
            writable: true
        },
        _first: {
            writable: true
        },
        _last: {
            writable: true
        },
        _next: {
            writable: true
        },
        _previous: {
            writable: true
        },
        _attributes: {
            value: new NamedNodeMap()
        },
        childNodes: {
            value: new NodeList([])
        },
        nodeName: {
            enumerable: true,
            value: nodeName
        },
        nodeValue: {
            enumerable: true,
            value: nodeValue
        },
        nodeType: {
            enumerable: true,
            value: nodeType
        },
        ownerDocument: {
            enumerable: true,
            value: ownerDocument
        }
    });
}

Node.ELEMENT_NODE = 1;
Node.ATTRIBUTE_NODE = 2;
Node.TEXT_NODE = 3;
Node.CDATA_SECTION_NODE = 4;
Node.ENTITY_REFERENCE_NODE = 5;
Node.ENTITY_NODE = 6;
Node.PROCESSING_INSTRUCTION_NODE = 7;
Node.COMMENT_NODE = 8;
Node.DOCUMENT_NODE = 9;
Node.DOCUMENT_TYPE_NODE = 10;
Node.DOCUMENT_FRAGMENT_NODE = 11;
Node.NOTATION_NODE = 12;

Node.prototype = Object.create(Object.prototype, {
    parentNode: {
        get: function() {
            return this._parent;
        }
    },
    firstChild: {
        get: function() {
            return this._first;
        }
    },
    lastChild: {
        get: function() {
            return this._last;
        }
    },
    nextSibling: {
        get: function() {
            return this._next;
        }
    },
    previousSibling: {
        get: function() {
            return this._previous;
        }
    },
    attributes: {
        get: function() {
            return this._attributes;
        }
    },
    textContent: {
        get: function() {
            switch (this.nodeType) {
                case Node.COMMENT_NODE:
                case Node.CDATA_SECTION_NODE:
                case Node.PROCESSING_INSTRUCTION_NODE:
                case Node.TEXT_NODE:
                    return this.nodeValue;

                case Node.ATTRIBUTE_NODE:
                case Node.DOCUMENT_FRAGMENT_NODE:
                case Node.ELEMENT_NODE:
                case Node.ENTITY_NODE:
                case Node.ENTITY_REFERENCE_NODE:
                    var out = '';
                    for (var i = 0; i < this.childNodes.length; ++i) {
                        if (this.childNodes.item(i).nodeType !== Node.COMMENT_NODE &&
                            this.childNodes.item(i).nodeType !== Node.PROCESSING_INSTRUCTION_NODE) {
                            out += this.childNodes.item(i).textContent || '';
                        }
                    }
                    return out;

                default:
                    return null;
            }
        }
    }
});

Node.prototype.constructor = Node;

// TODO test
Node.prototype.insertBefore = function(newChild) {
    throw new Error('not yet implemented');

    // if (newChild._parent) {
    //     newChild._parent.removeChild(newChild);
    // }

    // newChild._parent = this;

    // if (newChild._previous = this._first) {
    //     this._first._previous = newChild;
    // }

    // if (!this._last) {
    //     this._last = newChild;
    // }

    // this._first = newChild;

    // Array.prototype.push.call(this.childNodes, newChild);

    // return newChild;
};

Node.prototype.removeChild = function(oldChild) {

    if (oldChild._parent !== this) {
        throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR);
    }

    // TODO 性能优化
    Array.prototype.splice.call(this.childNodes, Array.prototype.indexOf.call(oldChild), 1);

    if (oldChild._previous) {
        oldChild._previous._next = oldChild._next;
    } else {
        this._first = oldChild._next;
    }

    if (oldChild._next) {
        oldChild._next._previous = oldChild._previous;
    } else {
        this._last = oldChild._previous;
    }

    oldChild._previous = oldChild._next = oldChild._parent = null;

    return oldChild;
};

Node.prototype.appendChild = function(newChild) {

    if (newChild._parent) {
        newChild._parent.removeChild(newChild);
    }

    newChild._parent = this;

    if (newChild._previous = this._last) {
        this._last._next = newChild;
    }

    if (!this._first) {
        this._first = newChild;
    }

    this._last = newChild;

    // TODO 性能优化
    Array.prototype.push.call(this.childNodes, newChild);

    return newChild;
};

Node.prototype.hasChildNodes = function() {
    return !!this._first;
};


module.exports = Node;