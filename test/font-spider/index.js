'use strict';

var crypto = require('crypto');
var browser = require('../../');
var path = require('path');
var url = require('url');

function FontSpider(htmlFile, options) {
    return browser.open(htmlFile, options).then(this.parse.bind(this));
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
        var cssFontFaceRules = [];
        var fontFamilyCssStyleRules = [];
        var contentCssStyleRules = [];



        // 获取 fontFace 列表
        this.eachCssFontFaceRule(function(cssFontFaceRule) {
            cssFontFaceRules.push(cssFontFaceRule);
        });



        this.eachCssStyleRule(function(cssStyleRule) {

            // 获取应用了 FontFace 的规则
            if (that.hasFontFace(cssStyleRule, cssFontFaceRules)) {
                fontFamilyCssStyleRules.push(cssStyleRule);
            }

            // 获取应用 content 的规则
            if (that.hasContent(cssStyleRule)) {
                contentCssStyleRules.push(cssStyleRule);
            }

        });



        // 获取应用了 @font-face 的文本
        fontFamilyCssStyleRules.map(function(cssStyleRule) {
            return that.matcheElements(cssStyleRule).forEach(function(element) {
                webFonts.push({
                    cssFontFaceRules: that.matcheFontFaces(cssStyleRule, cssFontFaceRules),
                    selectorText: cssStyleRule.selectorText,
                    content: element.textContent,
                    pseudoElementContent: that.getPseudoElementContent(contentCssStyleRules, element)
                });
            });
        });



        return cssFontFaceRules.map(function(cssFontFaceRule) {
            var baseURI = cssFontFaceRule.parentStyleSheet.href;
            var style = cssFontFaceRule.style;
            var src = style.src;
            var id = crypto.createHash('md5').update(src).digest('hex');
            var name = style['font-family'].replace(/^["']|["']$/g, '');
            var files = that.parseFontFaceSrc(src, baseURI);
            var chars = '';
            var selectors = [];

            webFonts.forEach(function(item) {
                if (item.cssFontFaceRules.indexOf(cssFontFaceRule) !== -1) {
                    chars += item.content;
                    chars += item.pseudoElementContent;
                    selectors.push(item.selectorText);
                }
            });

            return new WebFont(id, name, files, chars, selectors);
        });
    },



    /**
     * 获取当前节点伪元素 content 属性值
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
            var elements = this.matcheElements(cssStyleRule, true);

            if (hasOne(element, elements)) {
                return cssStyleRule.style.content.replace(/^["']|["']$/g, '');
            }

            return '';
        }, this).join('');


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
     * 查找与样式规则相匹配的元素列表
     * @param   {CSSStyleRule}
     * @return  {Array}         元素列表
     */
    matcheElements: function(cssStyleRule, isPseudo) {
        var document = this.document;
        var RE_DPSEUDOS = /\:(link|visited|target|active|focus|hover|checked|disabled|enabled|selected|lang\(([-\w]{2,})\)|not\(([^()]*|.*)\))?(.*)/i;
        var selectorText = cssStyleRule.selectorText;
        var selector;

        if (isPseudo) {
            selector = selectorText.replace(/\:+(before|after)$/, '') || '*';
        }

        selector = selectorText.replace(RE_DPSEUDOS, '');

        try {
            return Array.prototype.slice.call(document.querySelectorAll(selector));
        } catch (e) {
            return [];
        }
    },



    /**
     * 解析字体规则
     * @param   {CSSFontFaceRule}
     * @param   {FontFace}
     */
    // parseCssFontFaceRule: function(cssFontFaceRule) {

    //     var style = cssFontFaceRule.style;
    //     var fontFamily = style['font-family'];
    //     var files = [new FontType()]; // TODO 需要解析 src
    //     var FontWeight = style['font-weight'];
    //     var fontStyle = style['font-style'];
    //     var fontFace = new FontFace(fontFamily, files, FontWeight, fontStyle);

    //     return fontFace;
    // },



    /**
     * 解析 font-family 属性值为数组
     * @param   {String}
     * @return  {Array<String>}
     */
    parseFontfamily: function(fontFamily) {
        // TODO test
        var list = fontFamily
            .replace(/^\s*["']?|["']?\s*$|["']?\s*(,)\s*["']?/g, '$1')
            .split(',');
        return list;
    },

    /**
     * 解析 @font-face src 值
     * @param   {String}    src 的属性值
     * @param   {String}    基础路径
     * @return  {Array<String>}
     */
    parseFontFaceSrc: function(value, baseURI) {
        var list = [];
        var src;

        // url(../font/font.ttf)
        // url("../font/font.ttf")
        // url('../font/font.ttf')
        var RE_FONT_URL = /url\(["']?(.*?)["']?\)\s*format\(["']?(.*?)["']?\)/ig;

        RE_FONT_URL.lastIndex = 0;

        while ((src = RE_FONT_URL.exec(value)) !== null) {
            list.push(new FontFile(src[1], src[2], baseURI));
        }

        return list;
    },


    /**
     * 判断是否存在 @font-face 定义的字体
     * @param   {CSSStyleRule}
     * @param   {Array<CSSFontFaceRules>}
     * @return  {Boolean}
     */
    hasFontFace: function(cssStyleRule, cssFontFaceRules) {
        // TODO 判断重 FontWeight 与 fontStyle 是否匹配
        var style = cssStyleRule.style;
        var fontFamily = style['font-family'];

        if (!fontFamily) {
            return false;
        }

        var fontFamilys = this.parseFontfamily(fontFamily);
        for (var i = 0, len = cssFontFaceRules.length; i < len; i++) {
            var fontFaceName = cssFontFaceRules[i].style['font-family'];
            fontFaceName = fontFaceName.replace(/^["']|["']$/g, '');

            // TODO 判断重 FontWeight 与 fontStyle 是否匹配
            if (fontFamilys.indexOf(fontFaceName) !== -1) {
                return true;
            }
        }
        return false;
    },


    /**
     * 获取被当前 CSS 规则使用的 @font-face 规则
     * @param   {CSSStyleRule}
     * @param   {Array<CSSFontFaceRule>}
     * @return  {Array<CSSFontFaceRule>}
     */
    matcheFontFaces: function(cssStyleRule, cssFontFaceRules) {

        var style = cssStyleRule.style;
        var fontFamily = style['font-family'];
        var list = [];

        if (!fontFamily) {
            return list;
        }

        var fontFamilys = this.parseFontfamily(fontFamily);


        for (var i = 0, len = cssFontFaceRules.length; i < len; i++) {
            var fontFaceName = cssFontFaceRules[i].style['font-family'];
            fontFaceName = fontFaceName.replace(/^["']|["']$/g, '');

            // TODO 判断重 FontWeight 与 fontStyle 是否匹配
            if (fontFamilys.indexOf(fontFaceName) !== -1) {
                list.push(cssFontFaceRules[i]);
            }
        }

        return list;
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

        if (content && /\:+\w+$/.test(selectorText)) { // TODO
            return true;
        } else {
            return false;
        }
    },



    /**
     * 遍历自定义字体规则
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
     * 遍历选择器的规则
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
     * 遍历规则
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


/**
 * WebFont 描述类
 * @param   {String}            字体 ID
 * @param   {String}            字体名
 * @param   {Array<FontFile>}   路径列表
 * @param   {Array<String>}     应用的 CSS 选择器
 */
function WebFont(id, name, files, chars, selectors) {
    this.id = id;
    this.name = name;
    this.files = files;
    this.chars = chars;
    this.selectors = selectors;
    // TODO 粗细、风格
}


/**
 * font-face 路径与字体类型描述信息类
 * @param   {String}            路径
 * @param   {String}            类型
 */
function FontFile(source, format, baseURI) {

    if (baseURI) {
        source = url.resolve(baseURI, source);
    }

    if (!format) {

        switch (path.dirname(source.replace(/[\?#].*$/, '')).toLowerCase()) {
            case '.eot':
                format = 'embedded-opentype';
                break;
            case '.woff':
                format = 'woff';
                break;
            case '.ttf':
                format = 'truetype';
                break;
            case '.svg':
                format = 'svg';
                break;
        }
    }

    this.source = source;
    this.format = format;
}

FontFile.prototype.toString = function() {
    return this.source;
};


module.exports = function createFontSpider(htmlFiles, options) {

    if (!Array.isArray(htmlFiles)) {
        htmlFiles = [htmlFiles];
    }


    var queue = htmlFiles.map(function(htmlFile) {
        return new FontSpider(htmlFile, options);
    }, this);

    return Promise.all(queue);
};