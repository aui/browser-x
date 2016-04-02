'use strict';

var parse5 = require('parse5');

var Resource = require('./src/utils/resource');
var ParserAdapter = require('./src/adapters/parser-adapter');
var BrowserAdapter = require('./src/adapters/browser-adapter');
var loadCssFiles = require('./src/style/load-css-files');
var Window = require('./src/window');



/**
 * @param   {String}    HTML
 * @param   {Object}    选项（可选）@see ./src/adapters/browser-adapter
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


/**
 * @param   {String}    页面地址（本地或远程）
 * @param   {Object}    选项（可选）@see ./src/adapters/browser-adapter
 * @param   {Function}  回调函数（可选）
 * @param   {Promise}
 */
browser.open = function(url, options, callback) {
    options = new BrowserAdapter(options);
    options.baseURI = url;
    return (new Resource(options)).get(url).then(function(html) {
        return browser(html, options, callback);
    });
};


/**
 * @param   {String}    HTML
 * @param   {Object}    选项（可选）@see ./src/adapters/browser-adapter
 * @param   {Window}
 */
browser.sync = function(html, options) {
    options = new BrowserAdapter(options);
    options.parserAdapter = {
        treeAdapter: new ParserAdapter(options)
    };


    if (html.isBuffer && html.isBuffer() && html.path) {
        options.baseURI = html.path;
        html = html.toString();
    }


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
                    return Promise.reject(errors);
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


browser.BrowserAdapter = BrowserAdapter;


module.exports = browser;