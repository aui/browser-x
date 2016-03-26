'use strict';

var url = require('url');
var CSSStyleDeclaration = require('cssstyle').CSSStyleDeclaration;
var Element = require('../element');


function HTMLAnchorElement(document, name, namespaceURI) {
    Element.call(this, document, name, namespaceURI);
}

HTMLAnchorElement.prototype = Object.create(Element.prototype, {
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
    hostname: {
        get: function() {
            return url.parse(this.href).hostname || '';
        }
    },
    host: {
        get: function() {
            return url.parse(this.href).host || '';
        }
    },
    port: {
        get: function() {
            return url.parse(this.href).port || '';
        }
    },
    protocol: {
        get: function() {
            var protocol = url.parse(this.href).protocol;
            return (protocol === null) ? ':' : protocol;
        }
    },
    pathname: {
        get: function() {
            return url.parse(this.href).pathname || '';
        }
    },
    hash: {
        get: function() {
            return url.parse(this.href).hash || '';
        }
    }
});


HTMLAnchorElement.prototype.constructor = HTMLAnchorElement;
module.exports = HTMLAnchorElement;
