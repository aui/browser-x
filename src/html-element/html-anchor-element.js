'use strict';

var url = require('url');
var CSSStyleDeclaration = require('../style').CSSStyleDeclaration;
var Element = require('../element');


function HTMLAnchorElement(document, name, namespaceURI) {
    Element.call(this, document, name, namespaceURI);
}

HTMLAnchorElement.prototype = Object.create(Element.prototype, {
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
    href: {
        get: function() {
            var href = this.getAttribute('href');
            // TODO file://
            return url.resolve(this.ownerDocument.baseURI, href);
        }
    }
});


HTMLAnchorElement.prototype.constructor = HTMLAnchorElement;
module.exports = HTMLAnchorElement;