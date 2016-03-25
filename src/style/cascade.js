'use strict';

var specificity = require('specificity');
var CSSStyleDeclaration = require('cssstyle').CSSStyleDeclaration;
var eachCssStyleRule = require('./each-css-style-rule');


/**
 * 获取优先级信息
 * @param   {String}    选择器文本
 * @return  {Array}
 */
function getSpecificity(selectorText) {
    return specificity
        .calculate(selectorText)[0]
        .specificity
        .split(',')
        .map(function(s) {
            return parseInt(s, 10);
        });
}


/**
 * 优先级比较算法
 * @see     getSpecificity
 * @return  {Number}
 */
function compareSpecificity(first, second) {
    for (var i = 0; i < first.length; i++) {
        var a = first[i];
        var b = second[i];

        if (a === b) {
            continue;
        }

        return a - b;
    }

    return 0;
}


/**
 * 获取标准化伪元素名称
 * @param   {String}    伪名称
 * @return  {String}    格式化后的名称
 */
function normalizePseudo(value) {
    return value ? value.toLowerCase().replace(/\:+(\w+)$/, '$1') : '';
}


/**
 * 获取元素应用的样式，包括 style 属性、style 与 link 标签所引入的样式
 * @param   {HTMLElement}   元素
 * @param   {String}
 * @return  {CSSStyleDeclaration}
 */
function cascade(element, pseudo) {
    pseudo = normalizePseudo(pseudo);

    var cacheKey = '_cascade::' + pseudo;

    if (element[cacheKey]) {
        return element[cacheKey];
    }

    var document = element.ownerDocument;
    var cssStyleDeclarations = [];
    var style = new CSSStyleDeclaration();
    var importants = {};
    var forEach = Array.prototype.forEach;
    var pseudoRe = pseudo ? new RegExp('\\:+' + pseudo + '$', 'i') : null;

    // 行内样式
    cssStyleDeclarations.push(element.style);
    if (!element.style._specificity) {
        element.style._specificity = [1, 0, 0, 0];
    }

    // 非行内样式
    // StyleSheetList > CSSStyleSheet.cssRules > CSSStyleRule
    eachCssStyleRule(document, function(rule) {
        var selectorText = rule.selectorText;
        if (matches(element, selectorText)) {
            rule.style._specificity = getSpecificity(selectorText);
            cssStyleDeclarations.push(rule.style);
        }
    });


    // 优先级排序
    cssStyleDeclarations.sort(function(a, b) {
        return compareSpecificity(a._specificity, b._specificity);
    }).forEach(function(cssStyleDeclaration) {
        forEach.call(cssStyleDeclaration, cssStyleDeclarationForEach, cssStyleDeclaration);
    });


    function matches(element, selector) {
        if (pseudoRe) {
            // *::after
            // ::after
            // element::after
            selector = selector.replace(pseudoRe, '') || '*';
        }
        try {
            return element.matches(selector);
        } catch (e) {}
    }


    function cssStyleDeclarationForEach(key) {
        var cssStyleDeclaration = this;
        var important = cssStyleDeclaration.getPropertyPriority(key);

        // 当前样式属性覆盖规则，任意之一：
        // 1.当前声明了重要 2.之前没有声明重要 3.之前没有定义
        if (important || !importants[key] || !style[key]) {
            style[key] = cssStyleDeclaration[key];
        }

        importants[key] = important;
    }


    element[cacheKey] = style;

    return style;
}

module.exports = cascade;