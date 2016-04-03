'use strict';

var browser = require('../../');
var Adapter = require('./adapter');
var WebFont = require('./web-font');


function FontSpider(htmlFile, adapter) {
    adapter = new Adapter(adapter);
    return browser.open(htmlFile, adapter).then(this.parse.bind(this));
}

FontSpider.prototype = {

    constructor: FontSpider,

    window: null,
    document: null,

    parse: function(window) {

        var that = this;

        this.window = window;
        this.document = window.document;

        var webFonts = [];
        var elements = []; //Array<Array>
        //var pseudoElements = [];
        var pseudoCssStyleRules = [];
        //var PSEUDO_KEY = '_PSEUDO_KEY';

        console.time('找到fontFace');
        // 找到 fontFace
        this.eachCssFontFaceRule(function(cssRule) {
            var webFont = WebFont.parse(cssRule);
            webFonts.push(webFont);
        });
        console.timeEnd('找到fontFace');


        console.time('分析依赖');
        webFonts.forEach(function(webFont, index) {
            elements[index] = [];

            that.eachCssStyleRule(function(cssStyleRule) {

                // 如果当前规则包含已知的 webFont
                if (webFont.match(cssStyleRule)) {

                    webFont.selectors.push(cssStyleRule.selectorText);

                    if (that.hasContent(cssStyleRule)) {
                        // 伪元素直接拿 content 字段
                        webFont.chars += that.parseContent(cssStyleRule);
                    } else {

                        // 通过选择器查找元素拥有的文本节点
                        that.getElements(cssStyleRule).forEach(function(element) {
                            webFont.chars += element.textContent;
                            if (elements[index].indexOf(element) === -1) {
                                elements[index].push(element);
                            }
                        });
                    }

                } else if (that.hasContent(cssStyleRule)) {
                    // 暂存伪元素，以便进一步分析
                    pseudoCssStyleRules.push(cssStyleRule);

                    // var content = that.parseContent(cssStyleRule);
                    // that.getElements(cssStyleRule, true).forEach(function(element) {

                    //     if (pseudoElements.indexOf(element) === -1) {
                    //         pseudoElements.push(element);
                    //         element[PSEUDO_KEY] = '';
                    //     }

                    //     element[PSEUDO_KEY] += content;
                    // });
                }

            });
        });
        console.timeEnd('分析依赖');


        console.time('伪元素分析');
        // 分析伪元素的父元素是否应用了 webFont，并加入 chars
        // pseudoCssStyleRules.forEach(function(cssStyleRule) {
        //     webFonts.forEach(function(webFont, index) {
        //         elements[index].forEach(function(element) {
        //             if (that.containsPseudo(element, cssStyleRule)) {
        //                 webFont.selectors.push(cssStyleRule.selectorText);
        //                 webFont.chars += that.parseContent(cssStyleRule);
        //             }
        //         });
        //     });
        // });

        pseudoCssStyleRules.forEach(function(cssStyleRule) {
            var pseudoElements = that.getElements(cssStyleRule, true);
            pseudoElements.forEach(function(pseudoElement) {
                webFonts.forEach(function(webFont, index) {
                    if (containsPseudo(elements[index], pseudoElement)) {
                        var selector = cssStyleRule.selectorText;
                        var char = that.parseContent(cssStyleRule);
                        webFont.selectors.push(selector);
                        webFont.chars += char;
                    }
                });
            });

        });
        // for (var i = 0, e = pseudoElements.length; i < e; i++) {
        //     for (var n = 0, l = elements.length; n < l; n++) {
        //         if (containsPseudo(elements[n], pseudoElements[i])) {
        //             webFonts[n].chars += pseudoElements[i][PSEUDO_KEY];
        //         }
        //     }
        // }


        function containsPseudo(elements, element) {

            if (!elements.length) {
                return false;
            }

            while (element) {
                if (elements.indexOf(element) !== -1) {
                    return true;
                }
                element = element.parentNode;
            }

            return false;
        }
        console.timeEnd('伪元素分析');


        elements = null;
        pseudoCssStyleRules = null;



        return webFonts;
    },



    /**
     * 判断当前元素是否包含伪元素规则
     * @param   {Elment}
     * @param   {CSSStyleRule}
     * @return  {Boolean}
     */
    containsPseudo: function(element, cssStyleRule) {
        function contains(container, element) {
            while ((element = element.parentNode) && element.nodeType === 1) {
                if (element === container) return true;
            }
            return false;
        }

        function match(container, elements) {
            for (var i = 0, len = elements.length; i < len; i++) {
                if (container === elements[i] || contains(container, elements[i])) {
                    return true;
                }
            }
            return false;
        }

        var elements = this.getElements(cssStyleRule, true);

        return match(element, elements);
    },



    /**
     * 解析伪元素 content 属性值
     * @param   {CSSStyleRule}
     * @return  {String}
     */
    parseContent: function(cssStyleRule) {
        var RE_QUOTATION = /^["']|["']$/g;

        var content = cssStyleRule.style.content;

        // TODO 支持 content 其他规则
        content = content.replace(RE_QUOTATION, '');

        // 这里很容易出问题！！！！
        // TODO browser bug: CSOOM 获取的 unicode 字符没有被编码
        function fixEncoding(string) {
            string = JSON.stringify(string).replace(/\\\\(.{4})/g, '\\u$1');
            string = JSON.parse('{"string": ' + string + '}').string;
            return string;
        }

        content = fixEncoding(content);

        return content;
    },



    /**
     * 查找元素列表
     * @param   {CSSStyleRule}
     * @param   {Boolean}       是否匹配伪元素的父元素
     * @return  {Array}         元素列表
     */
    getElements: function(cssStyleRule, matchPseudoParent) {
        var document = this.document;
        var selectorText = cssStyleRule.selectorText;
        var RE_DPSEUDOS = /\:(link|visited|target|active|focus|hover|checked|disabled|enabled|selected|lang\(([-\w]{2,})\)|not\(([^()]*|.*)\))?(.*)/i;
        var selector = selectorText;

        if (matchPseudoParent) {
            selector = selector.replace(/\:\:?(?:before|after)$/i, '') || '*';
        }

        selector = selector.replace(RE_DPSEUDOS, '');

        try {
            return Array.prototype.slice.call(document.querySelectorAll(selector));
        } catch (e) {
            return [];
        }
    },



    /**
     * 判断是否有 content 属性，且有效
     * @param   {CSSStyleRule}
     * @return  {Boolean}
     */
    hasContent: function(cssStyleRule) {
        var selectorText = cssStyleRule.selectorText;
        var style = cssStyleRule.style;
        var content = style.content;

        if (content && /\:\:?(?:before|after)$/i.test(selectorText)) {
            return true;
        } else {
            return false;
        }
    },



    /**
     * 遍历每一条字体声明规则
     * @param   {Function}
     */
    eachCssFontFaceRule: function(callback) {
        var window = this.window;
        var CSSFontFaceRule = window.CSSFontFaceRule;
        this.eachCssRuleList(function(cssRule) {
            if (cssRule instanceof CSSFontFaceRule) {
                callback(cssRule);
            }
        });
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