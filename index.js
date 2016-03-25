'use strict';

var parse5 = require('parse5');
var cssom = require('cssom');
var cssstyle = require('cssstyle');

var Resource = require('./src/utils/resource');
var ParserAdapter = require('./src/adapter/parser-adapter');
var BrowserAdapter = require('./src/adapter/browser-adapter');
var loadCssFiles = require('./src/style/load-css-files');
var getComputedStyle = require('./src/style/get-computed-style');


/**
 * 创建一个浏览器实例
 * @param   {String}    HTML 代码
 * @param   {Object}    选项（可选）
 * @param   {Function}  回调函数（可选）
 * @param   {Promise}
 */
function browser(html, options, callback) {
    callback = callback || function() {};

    return new Promise(function(resolve, reject) {
        var window = browser.sync(html, options);
        window.onload = function() {
            resolve(window);
            callback(null, window);
        };
        window.onerror = function(errors) {
            reject(errors);
            callback(errors);
        };
    });
}



browser.load = function(url, options, callback) {
    options = new BrowserAdapter(options);
    options.baseUrl = url;
    return (new Resource(options)).get(url).then(function(html) {
        return browser(html, options, callback);
    });
};


browser.sync = function(html, options) {
    options = new BrowserAdapter(options);
    options.parserAdapter = {
        treeAdapter: new ParserAdapter(options)
    };

    var window = new Window();
    var document = parse5.parse(html, options.parserAdapter);

    document.defaultView = window;
    window.document = document;

    Object.defineProperty(window, 'onload', {
        get: function() {
            return this._onload;
        },
        set: function(onload) {
            this._onload = onload;

            if (options.loadCssFile) {
                loadCssFiles(document, new Resource(options)).then(function() {
                    process.nextTick(onload);
                }, function(errors) {
                    process.nextTick(function() {
                        if (typeof window.onerror === 'function') {
                            window.onerror(errors);
                        }
                    });
                });
            } else {
                process.nextTick(onload);
            }
        }
    });


    Object.defineProperty(window, 'onerror', {
        get: function() {
            return this._onerror;
        },
        set: function(onerror) {
            this._onerror = onerror;
        }
    });

    window._init();
    return window;
};


function Window() {
    this.document = null;
    this.onload = null;
    this.onerror = null;

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


Window.prototype._init = function() {

    if (this.document) {
        nwmatcherFix(this.document);
    } else {
         throw new Error('require `this.document`');
    }

    function nwmatcherFix(document) {
        var window = document.defaultView;

        // :target 选择器支持
        window.location = document.location = {
            hash: ''
        };

        // 避免判断为低版本浏览器
        document.constructor.prototype.addEventListener = function() {
            throw new Error('not yet implemented');
        };
    }

    delete this._init;
}



module.exports = browser;