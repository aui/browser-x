'use strict';

var url = require('url');
var CSSStyleDeclaration = require('../style').CSSStyleDeclaration;
var Element = require('../element');

function HTMLImageElement(document, name, namespaceURI) {
    Element.call(this, document, name, namespaceURI);
}

HTMLImageElement.prototype = Object.create(Element.prototype, {
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
    src: {
        get: function() {
            var src = this.getAttribute('src');
            // TODO file://
            return url.resolve(this.ownerDocument.baseURI, src);
        }
    }
});

HTMLImageElement.prototype.constructor = HTMLImageElement;

module.exports = HTMLImageElement;