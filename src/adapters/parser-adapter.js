'use strict';

var Document = require('../document');
var Comment = require('../comment');
var Node = require('../node');
var DocumentType = require('../document-type');

function ParserAdapter(options) {

    if (options instanceof ParserAdapter) {
        return options;
    }

    this.document = null;
    this.options = options;
}


ParserAdapter.prototype = {

    constructor: ParserAdapter,

    createDocument: function() {
        return this.document = new Document(this.options);
    },

    createDocumentFragment: function() {
        return this.document.createDocumentFragment();
    },

    createElement: function(tagName, namespaceURI, attrs) {
        var element = this.document.createElementNS(namespaceURI, tagName);
        attrs.forEach(function(a) {
            element.setAttribute(a.name, a.value);
        });
        return element;
    },

    createCommentNode: function(data) {
        return new Comment(this.document, data);
    },

    appendChild: function(parentNode, newChild) {
        if (!parentNode) {
            parentNode = this.document;
        }
        parentNode.appendChild(newChild);
    },

    insertBefore: function(parentNode, newNode, referenceNode) { // jshint ignore:line
        parentNode.insertBefore(parentNode, newNode);
    },

    setTemplateContent: function(templateElement, contentElement) { // jshint ignore:line
    },

    getTemplateContent: function() {},

    setDocumentType: function(document, name, publicId, systemId) {
        document.doctype = new DocumentType(document, name, publicId, systemId);
    },

    setQuirksMode: function(document) { // jshint ignore:line
    },

    isQuirksMode: function(document) { // jshint ignore:line
        return false;
    },

    detachNode: function(node) { // jshint ignore:line
    },

    insertText: function(node, data) {
        node.appendChild(this.document.createTextNode(data));
    },

    insertTextBefore: function(parentNode, text, referenceNode) { // jshint ignore:line
    },

    adoptAttributes: function(recipientNode, attrs) { // jshint ignore:line
    },

    getFirstChild: function(node) {
        return node.firstChild;
    },

    getChildNodes: function(node) {
        return node.childNodes;
    },

    getParentNode: function(node) {
        return node.parentNode;
    },

    getAttrList: function(node) {
        return node.attributes;
    },

    getTagName: function(node) {
        return node.tagName.toLowerCase();
    },

    getNamespaceURI: function(node) {
        return node.namespaceURI;
    },

    getTextNodeContent: function(node) {
        return node.data;
    },

    getCommentNodeContent: function(comment) {
        return comment.data;
    },

    getDocumentTypeNodeName: function(documentType) {
        return documentType.nodeName;
    },

    getDocumentTypeNodePublicId: function(documentType) {
        return documentType.publicId;
    },

    getDocumentTypeNodeSystemId: function(documentType) {
        return documentType.systemId;
    },

    isTextNode: function(node) {
        return node.nodeType === Node.TEXT_NODE;
    },

    isCommentNode: function(node) {
        return node.nodeType === Node.COMMENT_NODE;
    },

    isDocumentTypeNode: function(node) {
        return node.nodeType === Node.DOCUMENT_TYPE_NODE;
    },

    isElementNode: function(node) {
        return node.nodeType === Node.ELEMENT_NODE;
    }

};


module.exports = ParserAdapter;