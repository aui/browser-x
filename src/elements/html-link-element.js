'use strict';

var url = require('url');
var CSSStyleDeclaration = require('cssstyle').CSSStyleDeclaration;
var Element = require('../element');


function HTMLLinkElement(document, name, namespaceURI) {
    Element.call(this, document, name, namespaceURI);
}

HTMLLinkElement.prototype = Object.create(Element.prototype, {
    lang: {
        get: function() {
            return this.getAttribute('lang');
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
    },
    disabled: {
        get: function() {
            return this.hasAttribute('disabled');
        }
    }
});

HTMLLinkElement.prototype.constructor = HTMLLinkElement;
module.exports = HTMLLinkElement;