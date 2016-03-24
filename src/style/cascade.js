'use strict';

var specificity = require('specificity');
var CSSStyleDeclaration = require('cssstyle').CSSStyleDeclaration;
var eachCssStyleRule = require('./each-css-style-rule');

function getSpecificity(selectorText) {
    return specificity
        .calculate(selectorText)[0]
        .specificity
        .split(',')
        .map(function(s) {
            return parseInt(s, 10);
        });
}

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

function cascade(node, pseudo) {

    var cacheKey = '_cascade' +
        (pseudo ? pseudo.replace(/\:+$/, '') : '');

    if (node[cacheKey]) {
        return node[cacheKey];
    }

    var document = node.ownerDocument;
    var cssStyleDeclarations = [];
    var style = new CSSStyleDeclaration();
    var importants = {};
    var forEach = Array.prototype.forEach;
    var pseudoRe = pseudo ? new RegExp('\\:*' + pseudo + '$', 'i') : null;

    // 行内样式
    if (!pseudo && node.style) {
        cssStyleDeclarations.push(node.style);
        if (!node.style._specificity) {
            node.style._specificity = [1, 0, 0, 0];
        }
    }


    // 非行内样式
    // StyleSheetList > CSSStyleSheet.cssRules > CSSStyleRule
    eachCssStyleRule(document, function(rule) {
        var selectorText = rule.selectorText;
        if (matches(node, selectorText)) {
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


    function matches(node, selector) {
        if (pseudoRe) {
            selector = selector.replace(pseudoRe, '');
        }
        try {
            return node.matches(selector);
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


    node[cacheKey] = style;

    return style;
}

module.exports = cascade;