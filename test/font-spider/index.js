'use strict';

var browser = require('../../');
var FontFace = require('./font-face');
var Adapter = require('./adapter');


function FontSpider(htmlFile, adapter) {
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

        var fontFaces = [];
        this.eachCssRuleList(function(cssRule) {
            if (cssRule instanceof window.CSSFontFaceRule) {
                var fontFace = FontFace.parse(cssRule);
                fontFaces.push(fontFace);
            }
        });


        var pseudoCssStyleRules = [];

        var webFonts = fontFaces.map(function(fontFace) {
            var webFont = new FontSpider.WebFont(fontFace, '', []);
            webFont._elements = [];

            that.eachCssStyleRule(function(cssStyleRule) {

                if (fontFace.matche(cssStyleRule)) {
                    if (that.hasContent(cssStyleRule)) {
                        webFont.chars += that.parsePseudoElementContent(cssStyleRule);
                    } else {

                        that.matcheElements(cssStyleRule.selectorText)
                            .forEach(function(element) {
                                if (webFont._elements.indexOf(element) === -1) {
                                    webFont._elements.push(element);
                                }

                                webFont.chars += element.textContent;
                            });
                    }

                    webFont.selectors.push(cssStyleRule.selectorText);
                } else if (that.hasContent(cssStyleRule)) {
                    pseudoCssStyleRules.push(cssStyleRule);
                }

            });

            return webFont;
        });


        // 查找伪元素的 content 值
        webFonts.forEach(function(fontFace) {
            fontFace._elements.forEach(function(element) {
                fontFace.chars += that.getPseudoElementContent(pseudoCssStyleRules, element);
            });
        });


        return webFonts;
    },



    /**
     * 获取当前节点伪元素 content 属性值集合
     * @param   {Array<CSSStyleRule>}
     * @param   {Elment}
     * @return  {String}
     */
    getPseudoElementContent: function(cssStyleRules, element) {
        var that = this;

        function hasOne(container, elements) {
            for (var i = 0, n = elements.length; i < n; i++) {
                if (container === elements[i] || that.contains(container, elements[i])) {
                    return true;
                }
            }
            return false;
        }

        return cssStyleRules.map(function(cssStyleRule) {
            var elements = this.matcheElements(cssStyleRule.selectorText, true);

            if (hasOne(element, elements)) {
                return that.parsePseudoElementContent(cssStyleRule);
            }

            return '';
        }, this).join('');


    },



    /**
     * 解析伪元素 content 属性值
     * @param   {CSSStyleRule}
     * @return  {String}
     */
    parsePseudoElementContent: function(cssStyleRule) {
        var RE_QUOTATION = /^["']|["']$/g;
        // TODO 支持 content 其他规则
        return cssStyleRule.style.content.replace(RE_QUOTATION, '');
    },



    /**
     * @param   {Element}
     * @param   {Element}
     * @return  {Boolean}
     */
    contains: function(container, element) {
        while ((element = element.parentNode) && element.nodeType === 1) {
            if (element === container) return true;
        }
        return false;
    },



    /**
     * 查找元素列表
     * @param   {String}
     * @param   {Boolean}       是否匹配伪元素的父元素
     * @return  {Array}         元素列表
     */
    matcheElements: function(selectorText, matchePseudoParent) {
        var document = this.document;
        var RE_DPSEUDOS = /\:(link|visited|target|active|focus|hover|checked|disabled|enabled|selected|lang\(([-\w]{2,})\)|not\(([^()]*|.*)\))?(.*)/i;
        var selector = selectorText;

        if (matchePseudoParent) {
            selector = selector.replace(/\:+(before|after)$/, '') || '*';
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

        if (content && /\:+(before|after)$/.test(selectorText)) {
            return true;
        } else {
            return false;
        }
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

                if (cssRule instanceof CSSImportRule ||
                    cssRule instanceof CSSMediaRule) {

                    var cssStyleSheet = cssRule.styleSheet;
                    cssRuleListFor(cssStyleSheet.cssRules || [], callback);

                } else {
                    callback(cssRule);
                }

            }
        }

        styleSheetListFor(document.styleSheets, callback);
    }

};



FontSpider.WebFont = function WebFont(fontFace, chars, selectors) {
    Object.keys(fontFace).forEach(function(key) {
        this[key] = fontFace[key];
    }, this);
    this.chars = chars;
    this.selectors = selectors;
};



module.exports = function createFontSpider(htmlFiles, options, callback) {


    if (!Array.isArray(htmlFiles)) {
        htmlFiles = [htmlFiles];
    }

    callback = callback || function() {};


    var adapter = new Adapter(options);
    var queue = htmlFiles.map(function(htmlFile) {
        return new FontSpider(htmlFile, adapter);
    });

    return Promise.all(queue).then(function(webFonts) {

        webFonts = reduce(webFonts);

        var list = [];
        var indexs = {};


        // 合并相同 font-face 的查询数据
        webFonts.forEach(function(webFont) {
            var id = webFont.id;
            if (typeof indexs[id] === 'number') {
                var item = list[indexs[id]];
                item.chars += webFont.chars;
                item.selectors = item.selectors.concat(webFont.selectors);
                item.files = item.files.filter(function(file) {
                    return adapter.resourceIgnore(file.source);
                });
            } else {
                indexs[id] = list.length;
                list.push(webFont);
            }

            delete webFont._elements;
        });



        // 处理 chars 字段
        list.forEach(function(font) {

            var chars = font.chars.split('');

            // 对字符进行除重操作
            if (adapter.unique) {
                chars = unique(chars);
            }

            // 对字符按照编码进行排序
            if (adapter.sort) {
                chars.sort(sort);
            }

            // 删除无用字符
            chars = chars.join('').replace(/[\n\r\t]/g, '');

            font.chars = chars;
        });


        process.nextTick(function() {
            callback(null, list);
        });

        return list;
    }, function(errors) {
        process.nextTick(function() {
            callback(errors);
        });
        return errors;
    });



    // 扁平化二维数组
    function reduce(array) {
        var ret = [];

        array.forEach(function(item) {
            ret.push.apply(ret, item);
        });

        return ret;
    }


    function sort(a, b) {
        return a.charCodeAt() - b.charCodeAt();
    }


    function unique(array) {
        var ret = [];

        array.forEach(function(val) {
            if (ret.indexOf(val) === -1) {
                ret.push(val);
            }
        });

        return ret;
    }

};