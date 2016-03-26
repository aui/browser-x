'use strict';

var CSSOM = require('./style');
var getComputedStyle = require('./style/get-computed-style');


function Window() {
    this.document = null;
    this.onload = null;
    this.onerror = null;

    this.StyleSheet = CSSOM.StyleSheet;
    this.MediaList = CSSOM.MediaList;
    this.CSSStyleSheet = CSSOM.CSSStyleSheet;
    this.CSSRule = CSSOM.CSSRule;
    this.CSSStyleRule = CSSOM.CSSStyleRule;
    this.CSSMediaRule = CSSOM.CSSMediaRule;
    this.CSSImportRule = CSSOM.CSSImportRule;
    this.CSSStyleDeclaration = CSSOM.CSSStyleDeclaration;

    this.getComputedStyle = getComputedStyle;
}


// 针对 nwmatcher 的一些特殊处理
Window.prototype._init = function() {

    if (this.document) {
        nwmatcherFix(this.document);
    } else {
         throw new Error('require `this.document`');
    }

    function nwmatcherFix(document) {
        var window = document.defaultView;

        // :target 选择器支持
        window.location = document.location = {
            hash: ''
        };

        // 避免判断为低版本浏览器
        document.constructor.prototype.addEventListener = function() {
            throw new Error('not yet implemented');
        };
    }

    delete this._init;
};

module.exports = Window;