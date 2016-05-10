'use strict';

var cssom = require('cssom');
var url = require('url');
var VError = require('verror');
var Resource = require('../utils/resource');
var decode = require('../utils/decode');

function loadCssFiles(document, resource) {

    if (!(resource instanceof Resource)) {
        throw new Error('require `Resource`');
    }

    var styleSheets = document.styleSheets;
    var baseURI = document.baseURI;
    var silent = document._options.silent;
    var forEach = Array.prototype.forEach;
    var loadQueue = [];

    forEach.call(styleSheets, function(cssStyleSheet, index) {
        var ownerNode = cssStyleSheet.ownerNode;
        var nodeName = ownerNode.nodeName;

        if (nodeName === 'STYLE') {
            loadQueue.push(loadImportFile(baseURI, cssStyleSheet));
        } else if (nodeName === 'LINK') {
            var href = ownerNode.href;
            var file = decodeURIComponent(href);
            loadQueue.push(resource.get(file).then(function(data) {
                data = getContent(data);

                var cssStyleSheet = cssParse(data, file);
                cssStyleSheet.href = href;

                // TODO 在真正的浏览器中跨域，cssStyleSheet.cssRules 会等于 null
                styleSheets[index] = cssStyleSheet;

                return loadImportFile(href, cssStyleSheet);
            }, onerror));
        }
    });


    function loadImportFile(baseURI, cssStyleSheet) {
        var loadQueue = [];
        var forEach = Array.prototype.forEach;
        forEach.call(cssStyleSheet.cssRules, function(cssStyleRule) {
            if (cssStyleRule instanceof cssom.CSSImportRule) {

                var href = cssStyleRule.href;
                href = url.resolve(baseURI, href);

                var file = decodeURIComponent(href);

                loadQueue.push(resource.get(file).then(function(data) {
                    data = getContent(data);
                    var baseURI = href;
                    var cssStyleSheet = cssParse(data, file);
                    cssStyleSheet.parentStyleSheet = cssStyleSheet;
                    cssStyleSheet.href = href;
                    cssStyleRule.styleSheet = cssStyleSheet;
                    return loadImportFile(baseURI, cssStyleSheet);
                }, onerror));
            }
        });

        return Promise.all(loadQueue);
    }


    function onerror(errors) {
        if (silent) {
            return Promise.resolve('');
        } else {
            return Promise.reject(errors);
        }
    }


    function cssParse(data, file) {
        try {
            return cssom.parse(data);
        } catch (errors) {

            if (!silent) {
                throw new VError(errors, 'parse "%s" failed"', file);
            }

            return cssom.parse('');
        }
    }



    return Promise.all(loadQueue);
}



function getContent(content) {
    // 去掉 @charset，因为它可能触发 cssom 库的 bug
    // 使用空格占位避免改动代码位置
    content = decode(content, '\\');
    return content.replace(/^(\@charset\b.+?;)(.*?)/i, function($0, $1, $2) {
        var placeholder = new Array($1.length + 1).join(' ');
        return placeholder + $2;
    });
}



module.exports = loadCssFiles;