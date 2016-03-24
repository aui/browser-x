'use strict';

var Node = require('./node');

function DocumentFragment(ownerDocument) {
    Node.call(this, ownerDocument, '#document-fragment', null, Node.DOCUMENT_FRAGMENT_NODE);
}

DocumentFragment.prototype = Object.create(Node.prototype);
DocumentFragment.prototype.constructor = DocumentFragment;

module.exports = DocumentFragment;