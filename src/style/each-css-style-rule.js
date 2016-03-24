'use strict';

var cssom = require('cssom');
var CSSStyleRule = cssom.CSSStyleRule;
var CSSImportRule = cssom.CSSImportRule;
var CSSMediaRule = cssom.CSSMediaRule;

function styleSheetListFor(styleSheetList, callback) {
    for (var i = 0; i < styleSheetList.length; i++) {
        var cssStyleSheet = styleSheetList[i];
        var cssRuleList = cssStyleSheet.cssRules || [];
        cssRuleListFor(cssRuleList, callback);
    }
}


function cssRuleListFor(cssRuleList, callback) {
    for (var n = 0; n < cssRuleList.length; n++) {
        var cssRule = cssRuleList[n];

        if (cssRule instanceof CSSStyleRule) {
            callback(cssRule);
        } else if (cssRule instanceof CSSImportRule) {

            var cssStyleSheet = cssRule.styleSheet;
            cssRuleListFor(cssStyleSheet.cssRules || [], callback);

        } else if (cssRule instanceof CSSMediaRule) {
            // TODO
        }

    }
}


module.exports = function eachCssStyleRule(document, callback) {
    styleSheetListFor(document.styleSheets, callback);
};