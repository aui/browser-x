'use strict';

var cssom = require('cssom');
var url = require('url');
var VError = require('verror');
var Resource = require('../utils/resource');

function loadCssFiles(document, resource) {

    if (!(resource instanceof Resource)) {
        throw new Error('require `Resource`');
    }

    var styleSheets = document.styleSheets;
    var baseURI = document.baseURI;
    var debug = document._options.debug;
    var forEach = Array.prototype.forEach;
    var loadQueue = [];


    forEach.call(styleSheets, function(cssStyleSheet, index) {
        var ownerNode = cssStyleSheet.ownerNode;
        var nodeName = ownerNode.nodeName;

        if (nodeName === 'STYLE') {
            loadQueue.push(loadImportFile(resource, baseURI, cssStyleSheet, debug));
        } else if (nodeName === 'LINK') {
            var href = ownerNode.href;
            loadQueue.push(resource.get(href).then(function(data) {
                data = getContent(data);

                var cssStyleSheet = cssParse(data, href);
                cssStyleSheet.href = href;

                // TODO 在真正的浏览器中跨域，cssStyleSheet.cssRules 会等于 null
                styleSheets[index] = cssStyleSheet;

                return loadImportFile(resource, baseURI, cssStyleSheet, debug);
            }));
        }
    });



    return Promise.all(loadQueue);
}




function loadImportFile(resource, baseURI, cssStyleSheet, debug) {
    var loadQueue = [];
    var forEach = Array.prototype.forEach;
    forEach.call(cssStyleSheet.cssRules, function(cssStyleRule) {
        if (cssStyleRule instanceof cssom.CSSImportRule) {

            var href = cssStyleRule.href;
            var file = url.resolve(baseURI, href);

            loadQueue.push(resource.get(file).then(function(data) {
                data = getContent(data);
                var baseURI = file;
                var cssStyleSheet = cssParse(data, file, debug);
                cssStyleSheet.parentStyleSheet = cssStyleSheet;
                cssStyleSheet.href = file;
                cssStyleRule.styleSheet = cssStyleSheet;

                return loadImportFile(resource, baseURI, cssStyleSheet, debug);
            }));
        }
    });

    return Promise.all(loadQueue);
}




function cssParse(data, file, debug) {
    try {
        return cssom.parse(data);
    } catch (errors) {

        if (debug) {
            throw new VError(errors, 'parse "%s" failed', file);
        }

        return cssom.parse('');
    }
}




function getContent(content) {
    // 去掉 @charset，因为它可能触发 cssom 库的 bug
    // 使用空格占位避免改动代码位置
    return content.replace(/^(\@charset\b.+?;)(.*?)/i, function($0, $1, $2) {
        var placeholder = new Array($1.length + 1).join(' ');
        return placeholder + $2;
    });
}



module.exports = loadCssFiles;