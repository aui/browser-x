'use strict';
var cssom = require('cssom');
var cssstyle = require('cssstyle');

var CSSOM = {
    StyleSheet : cssom.StyleSheet,
    MediaList : cssom.MediaList,
    CSSStyleSheet : cssom.CSSStyleSheet,
    CSSRule : cssom.CSSRule,
    CSSStyleRule : cssom.CSSStyleRule,
    CSSMediaRule : cssom.CSSMediaRule,
    CSSImportRule : cssom.CSSImportRule,
    CSSStyleDeclaration : cssstyle.CSSStyleDeclaration
};

CSSOM.parse = cssom.parse;

module.exports = CSSOM;