'use strict';
var cssom = require('cssom');
var cssstyle = require('cssstyle');

var CSSOM = {
    CSSStyleDeclaration: cssstyle.CSSStyleDeclaration,
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
    MatcherList: cssom.MatcherList,
    CSSDocumentRule: cssom.CSSDocumentRule,
    CSSValue: cssom.CSSValue,
    CSSValueExpression: cssom.CSSValueExpression,
    parse: cssom.parse,
    clone: cssom.clone,
};

module.exports = CSSOM;