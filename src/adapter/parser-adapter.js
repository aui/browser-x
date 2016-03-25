'use strict';

var Document = require('../document');
var Comment = require('../comment');
var Node = require('../node');

function ParserAdapter(options) {
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
        if (!parentNode) parentNode = this.document;
        parentNode.appendChild(newChild);
    },

    insertBefore: function(parentNode, newNode, referenceNode) { // jshint ignore:line
        console.warn('parse5: insertBefore');
        parentNode.insertBefore(parentNode, newNode);
    },

    setTemplateContent: function(templateElement, contentElement) { // jshint ignore:line
        console.warn('parse5: setTemplateContent');
    },

    getTemplateContent: function() {
        console.warn('parse5: getTemplateContent');
    },

    setDocumentType: function(document, name, publicId, systemId) { // jshint ignore:line
        document._setDocumentType(name, publicId, systemId);
    },

    setQuirksMode: function(document) { // jshint ignore:line
        console.warn('parse5: setQuirksMode');
    },

    isQuirksMode: function(document) { // jshint ignore:line
        return false;
    },

    detachNode: function(node) { // jshint ignore:line
        console.warn('parse5: detachNode');
    },

    // TODO concatenate adjacent text nodes
    insertText: function(node, data) {
        node.appendChild(this.document.createTextNode(data));
    },

    insertTextBefore: function(parentNode, text, referenceNode) { // jshint ignore:line
        console.warn('parse5: insertTextBefore');
    },

    adoptAttributes: function(recipientNode, attrs) { // jshint ignore:line
        console.warn('parse5: adoptAttributes');
    },

    getFirstChild: function(node) {
        return node.firstChild;
    },

    getChildNodes: function(node) {
        var array = [];
        var child = node.firstChild;
        while (child) {
            array.push(child);
            child = child.nextSibling;
        }
        return array;
    },

    getParentNode: function(node) {
        return node.parentNode;
    },

    getAttrList: function(node) {
        var i = -1;
        var n = node.attributes.length;
        var a;
        var array = new Array(n);
        while (++i < n) array[i] = {
            name: (a = node.attributes.item(i)).nodeName,
            value: a.nodeValue
        };
        return array;
    },

    getTagName: function(node) {
        return node.tagName.toLocaleLowerCase();
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