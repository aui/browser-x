'use strict';

var cssom = require('./style');
var getComputedStyle = require('./style/get-computed-style');


function Window(document) {
    this.document = document;
    this.onerror = null;
    this.onload = null;
    this.getComputedStyle = getComputedStyle;

    this.CSSStyleDeclaration = cssom.CSSStyleDeclaration;
    this.CSSRule = cssom.CSSRule;
    this.CSSStyleRule = cssom.CSSStyleRule;
    this.MediaList = cssom.MediaList;
    this.CSSMediaRule = cssom.CSSMediaRule;
    this.CSSImportRule = cssom.CSSImportRule;
    this.CSSFontFaceRule = cssom.CSSFontFaceRule;
    this.StyleSheet = cssom.StyleSheet;
    this.CSSStyleSheet = cssom.CSSStyleSheet;
    this.CSSKeyframesRule = cssom.CSSKeyframesRule;
    this.CSSKeyframeRule = cssom.CSSKeyframeRule;

    nwmatcherFix(this);
}


// 针对 nwmatcher 的一些特殊处理
function nwmatcherFix(window) {

    var document = window.document;

    // :target 选择器支持
    window.location = document.location = {
        hash: ''
    };

    // 避免判断为低版本浏览器
    document.constructor.prototype.addEventListener = function() {
        throw new Error('not yet implemented');
    };
}

module.exports = Window;