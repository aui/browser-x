'use strict';
var url = require('url');

var Element = require('./element');
var CSSStyleDeclaration = require('cssstyle').CSSStyleDeclaration;

function HTMLElement(document, name, namespaceURI) {
    Element.call(this, document, name, namespaceURI);
}

HTMLElement.prototype = Object.create(Element.prototype, {
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

    // TODO 需要迁移至 HTMLImageElement 等拥有该属性的元素的构造器
    // ---------------------------------------------
    // src: {
    //     get: function() {
    //         switch (this.nodeName) {
    //             case 'SCRIPT':
    //             case 'IMG':
    //             case 'IFRAME':
    //             case 'EMBED':
    //                 var src = this.getAttribute('src');
    //                 if (src) {
    //                     return url.resolve(this.ownerDocument.baseURI, src);
    //                 }
    //         }
    //     }
    // },
    // href: {
    //     get: function() {
    //         switch (this.nodeName) {
    //             case 'A':
    //             case 'LINK':
    //                 var href = this.getAttribute('href');
    //                 if (href) {
    //                     return url.resolve(this.ownerDocument.baseURI, href);
    //                 }
    //                 break;
    //             case 'BASE':
    //                 return this.getAttribute('href');
    //         }
    //     }
    // },
    // // 这里主要是让 nwmatcher 支持高级 CSS 选择器
    // // ---------------------------------------------
    // disabled: {
    //     get: function() {
    //         // ['INPUT', 'BUTTON', 'SELECT', 'LINK']
    //         return this.hasAttribute('disabled');
    //     }
    // },
    // checked: {
    //     get: function() {
    //         // ['INPUT']
    //         return this.hasAttribute('checked');
    //     }
    // },
    // selected: {
    //     get: function() {
    //         // TODO <option>
    //         return this.hasAttribute('selected');
    //     }
    // },
    // type: {
    //     get: function() {

    //         // ['INPUT', 'BUTTON', 'SCRIPT', 'LINK']
    //         if (this.nodeName === 'INPUT') {
    //             return this.getAttribute('type') || 'text';
    //         } else if (this.nodeName === 'BUTTON') {
    //             return this.getAttribute('type') || 'submit';
    //         } else {
    //             return this.getAttribute('type') || '';
    //         }
    //     }
    // },
    // value: {
    //     get: function() {
    //         // ['INPUT', 'TEXTAREA', 'OPTION', 'SELECT']
    //         if (this.nodeName === 'INPUT' || this.nodeName === 'SELECT') {
    //             return this.getAttribute('value') || '';
    //         } else if (this.nodeName === 'TEXTAREA') {
    //             return this.textContent || '';
    //         } else if (this.nodeName === 'OPTION') {
    //             return this.hasAttribute('value') ? this.getAttribute('value') : this.innerHTML;
    //         }
    //     }
    // },
    // form: {
    //     get: function() {

    //         // ['INPUT', 'BUTTON', 'SELECT', 'OPTION', 'FIELDSET', 'LABEL', 'LEGEND', 'OBJECT']
    //         var e = this;
    //         while (e) {
    //             if (e.nodeName === 'FORM') {
    //                 return e;
    //             }
    //             e = e.parentNode;
    //         }

    //         return null;
    //     }
    // }
    // ---------------------------------------------
});


HTMLElement.prototype.constructor = HTMLElement;


module.exports = HTMLElement;