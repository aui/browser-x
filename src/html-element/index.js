'use strict';

var config = {
    '*': require('./html-element'),
    'A': require('./html-anchor-element'),
    'IMG': require('./html-image-element'),
    'LINK': require('./html-link-element'),

    'FORM': require('./html-form-element'),
    'BUTTON': require('./html-button-element'),
    'INPUT': require('./html-input-element'),
    'SELECT': require('./html-select-element'),
    'OPTION': require('./html-option-element'),
    'TEXTAREA': require('./html-text-area-element')
};

var CSSStyleDeclaration = require('cssstyle').CSSStyleDeclaration;



Object.keys(config).forEach(function(name) {
    define(config[name].prototype);
});


// 定义元素通用的属性与方法
function define(prototype) {
    Object.defineProperties(prototype, {
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
        }
    });
}



function createElementNS(document, namespaceURI, tagName) {
    tagName = tagName.toUpperCase();
    if (config.hasOwnProperty(tagName)) {
        return new config[tagName](document, tagName, namespaceURI);
    } else {
        return new config['*'](document, tagName, namespaceURI);
    }
}


module.exports = createElementNS;