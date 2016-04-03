'use strict';

var cssom = require('cssom');
var cssMediaQuery = require('css-mediaquery');
var CSSStyleRule = cssom.CSSStyleRule;
var CSSImportRule = cssom.CSSImportRule;
var CSSMediaRule = cssom.CSSMediaRule;

var SCREEN_CONFIG = {
    type: 'screen',
    width: '1440px'
};

function cssRuleListFor(cssRuleList, callback) {
    for (var n = 0; n < cssRuleList.length; n++) {
        var cssRule = cssRuleList[n];

        if (cssRule instanceof CSSStyleRule) {
            callback(cssRule);
        } else if (cssRule instanceof CSSImportRule) {

            var cssStyleSheet = cssRule.styleSheet;
            cssRuleListFor(cssStyleSheet.cssRules || [], callback);

        } else if (cssRule instanceof CSSMediaRule) {
            Array.prototype.forEach.call(cssRule.media, function(media) {
                if (cssMediaQuery.match(media, SCREEN_CONFIG)) {
                    cssRuleListFor(cssRule.cssRules || [], callback);
                }
            });
        }

    }
}


module.exports = function eachCssStyleRule(document, callback) {
    var window = document.defaultView;
    var styleSheetList = document.styleSheets;

    for (var i = 0; i < styleSheetList.length; i++) {
        var cssStyleSheet = styleSheetList[i];
        var cssRuleList = cssStyleSheet.cssRules || [];
        cssRuleListFor(cssRuleList, callback);
    }
};