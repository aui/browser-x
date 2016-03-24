'use strict';
var cssom = require('cssom');
var url = require('url');
var Resource = require('../utils/resource');

function loadCssFiles(document, resource) {

    if (!(resource instanceof Resource)) {
        throw new Error('require `Resource`');
    }

    var MAX_IMPORT = 64;
    var styleSheets = document.styleSheets;
    var baseURI = document.baseURI;
    var forEach = Array.prototype.forEach;
    var queue = [];


    forEach.call(styleSheets, function(cssStyleSheet) {
        var ownerNode = cssStyleSheet.ownerNode;
        var nodeName = ownerNode.nodeName;

        if (nodeName === 'STYLE') {
            queue.push(loadImportFile(baseURI, cssStyleSheet));
        } else if (nodeName === 'LINK') {
            var href = ownerNode.getAttribute('href');
            var file = url.resolve(baseURI, href);
            queue.push(resource.get(file).then(function(data) {
                cssStyleSheet.cssRules = cssom.parse(data).cssRules;
                return loadImportFile(baseURI, cssStyleSheet);
            }));
        }
    });


    function loadImportFile(baseURI, cssStyleSheet) {
        var parentStyleSheet = cssStyleSheet;
        var loadQueue = [];
        forEach.call(cssStyleSheet.cssRules, function(cssStyleRule) {
            if (cssStyleRule instanceof cssom.CSSImportRule) {

                if (MAX_IMPORT === 0) {
                    throw new Error('Exceeding the maximum limit on the number of file import');
                }

                var href = cssStyleRule.href;
                var file = url.resolve(baseURI, href);

                MAX_IMPORT --;

                loadQueue.push(resource.get(file).then(function(data) {
                    var cssStyleSheet = cssom.parse(data);
                    cssStyleSheet.parentStyleSheet = parentStyleSheet;
                    cssStyleRule.styleSheet = cssStyleSheet;
                    return loadImportFile(file, cssStyleSheet);
                }));
            }
        });

        return Promise.all(loadQueue);
    }

    return Promise.all(queue);
}

module.exports = loadCssFiles;