'use strict';
var nwmatcher = require('nwmatcher/src/nwmatcher-noqsa');
var parse5 = require('parse5');


var Attr = require('./attr');
var Node = require('./node');
var NodeList = require('./node-list');
var NamedNodeMap = require('./named-node-map');

function Element(ownerDocument, name, namespaceURI) {
    Node.call(this, ownerDocument, name, null, Node.ELEMENT_NODE);
    Object.defineProperties(this, {
        namespaceURI: {
            enumerable: true,
            value: namespaceURI
        },
        _attributes: {
            value: new NamedNodeMap()
        }
    });
}

Element.prototype = Object.create(Node.prototype, {
    attributes: {
        get: function() {
            return this._attributes;
        }
    },
    id: {
        get: function() {
            return this.getAttribute('id') || '';
        }
    },
    className: {
        get: function() {
            return this.getAttribute('class') || '';
        }
    },
    tagName: {
        get: function() {
            return this.nodeName;
        }
    },
    innerHTML: {
        get: function() {
            return parse5.serialize(this, this.ownerDocument._options.parserAdapter);
        }
    },
    outerHTML: {
        get: function() {
            // @see parse5: SerializerOptions.getChildNodes
            return parse5.serialize({
                childNodes: new NodeList([this])
            }, this.ownerDocument._options.parserAdapter);
        }
    }

});

Element.prototype.constructor = Element;

Element.prototype.hasAttribute = function(name) {
    return this._attributes.getNamedItem(name) !== null;
};

Element.prototype.getAttribute = function(name) {
    var attr = this._attributes.getNamedItem(name);
    return attr && attr.nodeValue;
};

Element.prototype.setAttribute = function(name, value) {
    var attr = new Attr(this.ownerDocument, name, true, value);
    this._attributes.setNamedItem(attr);
};

Element.prototype.removeAttribute = function(name) {
    this._attributes.removeNamedItem(name);
};

Element.prototype.getAttributeNode = function(name) {
    return this._attributes.getNamedItem(name);
};

Element.prototype.setAttributeNode = function() {
    throw new Error('not yet implemented');
};

Element.prototype.removeAttributeNode = function() {
    throw new Error('not yet implemented');
};

Element.prototype.getElementsByClassName = function() {
    throw new Error('not yet implemented');
};

Element.prototype.querySelector = function(selector) {
    return matcher(this).first(selector, this);
};

Element.prototype.querySelectorAll = function(selector) {
    return new NodeList(matcher(this).select(selector, this));
};

Element.prototype.matches = function(selector) {
    return matcher(this).match(this, selector);
};

Element.prototype.getElementsByTagName = function(tagName) {
    var nodes = [];
    var child = this.firstChild;

    tagName = tagName.toUpperCase();

    out: while (child) {

        if (child.nodeType === Node.ELEMENT_NODE) {
            if (tagName === '*' || child.tagName === tagName) {
                nodes.push(child);
            }
        }

        if (child.firstChild) {
            child = child.firstChild;
        } else if (child.nextSibling) {
            child = child.nextSibling;
        } else {
            do {
                child = child.parentNode;
                if (child === this) {
                    break out;
                }
            } while (!child.nextSibling);

            child = child.nextSibling;
        }
    }

    return new NodeList(nodes);
};


function matcher(element) {
    var document = element.ownerDocument;
    var matcher = document._matcher;

    if (matcher) {
        return matcher;
    }

    matcher = nwmatcher({
        document: document
    });

    Object.defineProperty(document, '_matcher', {
        value: matcher
    });

    return matcher;
}

module.exports = Element;