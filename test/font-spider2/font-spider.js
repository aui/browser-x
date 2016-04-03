'use strict';

var browser = require('../../');
var FontFace = require('./font-face');
var Adapter = require('./adapter');


function FontSpider(htmlFile, adapter) {
    adapter = new Adapter(adapter);
    return browser.open(htmlFile, adapter).then(this.parse.bind(this));
}


FontSpider.prototype = {

    constructor: FontSpider,

    window: null,
    document: null,

    parse: function(window) {


        var document = window.document;
        var getComputedStyle = window.getComputedStyle;
        this.window = window;
        this.document = document;

        var webFonts = [];
        this.eachCssRuleList(function(cssRule) {
            if (cssRule instanceof window.CSSFontFaceRule) {
                var webFont = FontFace.parse(cssRule);
                webFonts.push(webFont);
            }
        });

        if (!webFonts.length) {
            return webFonts;
        }

        var elements = document.querySelectorAll('body, body *:not(style):not(script)');
        var length = elements.length;
        var element, webFont;

        for (var i = 0; i < length; i++) {
            element = elements[i];
            for (var n = 0, len = webFonts.length; n < len; n++) {
                webFont = webFonts[n];
                if (webFont.matche(element)) {
                    webFont.chars += element.textContent;
                    webFont.chars += getComputedStyle(element, '::before').content;
                    webFont.chars += getComputedStyle(element, '::after').content;
                }
            }
        }


        return webFonts;
    },



    /**
     * 遍历每一条选择器的规则
     * @param   {Function}
     */
    eachCssStyleRule: function(callback) {

        var window = this.window;
        var CSSStyleRule = window.CSSStyleRule;

        this.eachCssRuleList(function(cssRule) {
            if (cssRule instanceof CSSStyleRule) {
                callback(cssRule);
            }
        });
    },


    /**
     * 遍历每一条规则
     * @param   {Function}
     */
    eachCssRuleList: function(callback) {

        var window = this.window;
        var document = window.document;
        var CSSImportRule = window.CSSImportRule;
        var CSSMediaRule = window.CSSMediaRule;

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

                if (cssRule instanceof CSSImportRule) {

                    var cssStyleSheet = cssRule.styleSheet;
                    cssRuleListFor(cssStyleSheet.cssRules || [], callback);

                } else if (cssRule instanceof CSSMediaRule) {
                    cssRuleListFor(cssRule.cssRules || [], callback);
                } else {

                    callback(cssRule);

                }

            }
        }

        styleSheetListFor(document.styleSheets, callback);
    }

};


module.exports = FontSpider;