'use strict';

var path = require('path');
var url = require('url');
var crypto = require('crypto');
var browser = require('../../');

var Adapter = require('./adapter');
var RE_QUOTATION = /^["']|["']$/g;



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
                    selectorText: cssStyleRule.selectorText, // TODO 伪元素的选择器
                    content: element.textContent,
                    pseudoElementContent: that.getPseudoElementContent(contentCssStyleRules, element)
                });
            });
        });



        return cssFontFaceRules.map(function(cssFontFaceRule) {
            var baseURI = cssFontFaceRule.parentStyleSheet.href;
            var style = cssFontFaceRule.style;
            var src = style.src;
            var name = style['font-family'].replace(RE_QUOTATION, '');
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

            return new WebFont(name, files, chars, selectors);
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
                return cssStyleRule.style.content.replace(RE_QUOTATION, '');
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
        var selector = selectorText;

        if (isPseudo) {
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

        var RE_FONT_URL = /url\(["']?(.*?)["']?\)(?:\s*format\(["']?(.*?)["']?\))?/ig;

        RE_FONT_URL.lastIndex = 0;

        while ((src = RE_FONT_URL.exec(value)) !== null) {
            list.push(new FontFile(baseURI, src[1], src[2]));
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
        return !!this.matcheFontFaces(cssStyleRule, cssFontFaceRules).length;
    },


    /**
     * 获取被当前 CSS 规则使用的 @font-face 规则
     * TODO    https://www.w3.org/html/ig/zh/wiki/CSS3字体模块#.E5.AD.97.E4.BD.93.E5.8C.B9.E9.85.8D.E7.AE.97.E6.B3.95
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
            fontFaceName = fontFaceName.replace(RE_QUOTATION, '');

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

        if (content && /\:+(before|after)$/.test(selectorText)) {
            return true;
        } else {
            return false;
        }
    },



    /**
     * 遍历每一条自定义字体规则
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
 * @param   {String}            字体名
 * @param   {Array<FontFile>}   路径列表
 * @param   {String}            被网页应用的字符
 * @param   {Array<String>}     应用的 CSS 选择器
 */
function WebFont(name, files, chars, selectors) {
    this.id = crypto
        .createHash('md5')
        .update(files.join(','))
        .digest('hex');

    this.name = name;
    this.files = files;
    this.chars = chars;
    this.selectors = selectors;

    // TODO 粗细、风格
}


/**
 * font-face 路径与字体类型描述信息类
 * @param   {String}            基础路径
 * @param   {String}            源路径
 * @param   {String}            类型
 */
function FontFile(baseURI, source, format) {

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
    } else {
        format = format.toLowerCase();
    }

    this.source = source;
    this.format = format;
}

FontFile.prototype.toString = function() {
    return this.source;
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