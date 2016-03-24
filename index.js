'use strict';

var parse5 = require('parse5');
var cssom = require('cssom');
var cssstyle = require('cssstyle');

var Resource = require('./src/utils/resource');
var ParserAdapter = require('./src/utils/parser-adapter');
var loadCssFiles = require('./src/style/load-css-files');
var getComputedStyle = require('./src/style/get-computed-style');

module.exports = function browser(html, options, callback) {
    options = options || {};
    callback = callback || function() {};

    options.parserAdapter = options.parserAdapter || {
        treeAdapter: new ParserAdapter(options)
    };

    return new Promise(function(resolve, reject) {
        var window = new Window();
        var document =  parse5.parse(html, options.parserAdapter);

        document.defaultView = window;
        window.document = document;

        nwmatcherFix(window);

        if (options.loadCssFile) {
            loadCssFiles(document, new Resource(options)).then(function() {
                resolve(window);
                callback(null, window);
            }, function(errors) {
                reject(errors);
                callback(errors);
            });
        } else {
            resolve(window);
            callback(null, window);
        }
    });
};



function Window() {
    this.document = null;

    this.StyleSheet = cssom.StyleSheet;
    this.MediaList = cssom.MediaList;
    this.CSSStyleSheet = cssom.CSSStyleSheet;
    this.CSSRule = cssom.CSSRule;
    this.CSSStyleRule = cssom.CSSStyleRule;
    this.CSSMediaRule = cssom.CSSMediaRule;
    this.CSSImportRule = cssom.CSSImportRule;
    this.CSSStyleDeclaration = cssstyle.CSSStyleDeclaration;
    this.getComputedStyle = getComputedStyle;
}

function nwmatcherFix(window) {
    var document = window.document;

    // :target 选择器支持
    window.location = document.location = {
        hash: ''
    };

    // 避免判断为低版本浏览器
    document.constructor.prototype.addEventListener = function() {
        throw new Error('not yet implemented');
    };
}