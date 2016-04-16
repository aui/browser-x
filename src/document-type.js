'use strict';

var NamedNodeMap = require('./named-node-map');
var Node = require('./node');

function DocumentType(ownerDocument, name, publicId, systemId) {
    Node.call(this, ownerDocument, name, null, Node.DOCUMENT_TYPE_NODE);
    Object.defineProperties(this, {
        entities: {
            value: new NamedNodeMap()
        },
        notations: {
            value: new NamedNodeMap()
        },
        publicId: {
            value: publicId
        },
        systemId: {
            value: systemId
        }
    });
}

DocumentType.prototype = Object.create(Node.prototype, {
    name: {
        get: function() {
            return this.nodeName;
        }
    }
});

DocumentType.prototype.constructor = DocumentType;

module.exports = DocumentType;