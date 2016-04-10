'use strict';

var VError = require('verror');
var cssom = require('./style');
var Attr = require('./attr');
var Comment = require('./comment');
var DocumentType = require('./document-type');
var Element = require('./element');
var HTMLElement = require('./html-element');
var Node = require('./node');
var Text = require('./text');
var StyleSheetList = require('./style-sheet-list');
var Window = require('./window');


function Document(options) {
    Node.call(this, this, '#document', null, Node.DOCUMENT_NODE);
    this.defaultView = new Window(this);
    this._doctype = null;
    this._documentElement = null;
    this._styleSheets = null;
    this._options = options;
    this._url = options.url;
}

Document.prototype = Object.create(Node.prototype, {
    URL: {
        get: function() {
            // TODO
            return this._url;
        }
    },
    baseURI: {
        get: function() {
            var base = this.getElementsByTagName('base').item(0);
            if (base) {
                return base.getAttribute('href');
            } else {
                return this._url;
            }
        }
    },
    doctype: {
        get: function() {
            return this._doctype;
        }
    },
    compatMode: {
        get: function() {
            return 'CSS1Compat';
        }
    },
    documentElement: {
        get: function() {
            if (this._documentElement) {
                return this._documentElement;
            } else {
                var child = this._first;
                while (child) {
                    if (child.nodeType === Node.ELEMENT_NODE) {
                        return this._documentElement = child;
                    }
                    child = child._next;
                }
                return null;
            }
        }
    },
    head: {
        get: function() {
            return this.getElementsByTagName('head').item(0);
        }
    },
    title: {
        get: function() {
            return this.getElementsByTagName('title').item(0).textContent;
        }
    },
    body: {
        get: function() {
            return this.getElementsByTagName('body').item(0);
        }
    },
    styleSheets: {
        get: function() {
            var silent = this._options.silent;

            if (!this._styleSheets) {
                this._styleSheets = new StyleSheetList();

                // TODO test media
                var nodeList = this.querySelectorAll('style,link[rel=stylesheet]:not([disabled])');

                for (var i = 0; i < nodeList.length; i++) {

                    var ownerNode = nodeList.item(i);
                    var textContent = ownerNode.textContent;
                    var cssStyleSheet = cssParse(textContent, this.URL, silent);

                    if (ownerNode.nodeName === 'LINK') {
                        cssStyleSheet.cssRules = null;
                        cssStyleSheet.href = ownerNode.href;
                    } else {
                        cssStyleSheet.href = null;
                    }

                    cssStyleSheet.ownerNode = ownerNode;
                    this._styleSheets.push(cssStyleSheet);
                }
            }


            return this._styleSheets;

            function cssParse(data, file, silent) {
                try {
                    return cssom.parse(data);
                } catch (errors) {
                    if (!silent) {
                        throw new VError(errors, 'parse "%s" failed. <style>%s</style>', file, data);
                    }
                    return cssom.parse('');
                }
            }
        }
    }
});

Document.prototype.constructor = Document;

Document.prototype.createElement = function(tagName) {
    var namespaceURI = this.documentElement.namespaceURI;
    return this.createElementNS(namespaceURI, tagName);
};

Document.prototype.createElementNS = function(namespaceURI, tagName) {
    return HTMLElement(this, namespaceURI, tagName);
};

Document.prototype.createDocumentFragment = function() {
    throw new Error('not yet implemented');
};

Document.prototype.createTextNode = function(data) {
    return new Text(this, data);
};

Document.prototype.createComment = function(data) {
    return new Comment(this, data);
};

Document.prototype.createAttribute = function(name) {
    return new Attr(this, name, false, '');
};

Document.prototype.getElementsByTagName = function(tagName) {
    return Element.prototype.getElementsByTagName.call(this, tagName);
};

// TODO restrict to just Element types
// TODO 性能优化
Document.prototype.getElementById = function(id) {
    var child = this.firstChild;

    out: while (child) {
        if (child.id === id) {
            return child;
        }
        if (child.firstChild) {
            child = child.firstChild;
        } else if (child.nextSibling) {
            child = child.nextSibling;
        } else {
            do {
                child = child.parentNode;
                if (child === this) break out;
            } while (!child.nextSibling);
            child = child.nextSibling;
        }
    }

    return null;
};

Document.prototype.querySelector = function(selector) {
    return Element.prototype.querySelector.call(this, selector);
};

Document.prototype.querySelectorAll = function(selector) {
    return Element.prototype.querySelectorAll.call(this, selector);
};


Document.prototype._setDocumentType = function(name, publicId, systemId) {
    this._doctype = new DocumentType(this, name, publicId, systemId);
};


module.exports = Document;