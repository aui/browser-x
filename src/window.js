'use strict';

var cssom = require('./style');
var getComputedStyle = require('./style/get-computed-style');


function Window() {
    this.document = null;
    this.onerror = null;
    this.getComputedStyle = getComputedStyle;
    //
    this.screen = {
        width: 1440
    };

    this.CSSStyleDeclaration= cssom.CSSStyleDeclaration;
    this.CSSRule= cssom.CSSRule;
    this.CSSStyleRule= cssom.CSSStyleRule;
    this.MediaList= cssom.MediaList;
    this.CSSMediaRule= cssom.CSSMediaRule;
    this.CSSImportRule= cssom.CSSImportRule;
    this.CSSFontFaceRule= cssom.CSSFontFaceRule;
    this.StyleSheet= cssom.StyleSheet;
    this.CSSStyleSheet= cssom.CSSStyleSheet;
    this.CSSKeyframesRule= cssom.CSSKeyframesRule;
    this.CSSKeyframeRule= cssom.CSSKeyframeRule;
    this.MatcherList= cssom.MatcherList;
    this.CSSDocumentRule= cssom.CSSDocumentRule;
    this.CSSValue= cssom.CSSValue;
    this.CSSValueExpression= cssom.CSSValueExpression;
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