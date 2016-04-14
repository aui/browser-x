'use strict';
var cssom = require('cssom');
//var CSSStyleDeclaration = require('cssstyle').CSSStyleDeclaration;

var CSSOM = {
    CSSStyleDeclaration: cssom.CSSStyleDeclaration,
    CSSRule: cssom.CSSRule,
    CSSStyleRule: cssom.CSSStyleRule,
    MediaList: cssom.MediaList,
    CSSMediaRule: cssom.CSSMediaRule,
    CSSImportRule: cssom.CSSImportRule,
    CSSFontFaceRule: cssom.CSSFontFaceRule,
    StyleSheet: cssom.StyleSheet,
    CSSStyleSheet: cssom.CSSStyleSheet,
    CSSKeyframesRule: cssom.CSSKeyframesRule,
    CSSKeyframeRule: cssom.CSSKeyframeRule,
    //MatcherList: cssom.MatcherList,
    //CSSDocumentRule: cssom.CSSDocumentRule,
    //CSSValue: cssom.CSSValue,
    //CSSValueExpression: cssom.CSSValueExpression,
    parse: cssom.parse,
    clone: cssom.clone,
};

module.exports = CSSOM;