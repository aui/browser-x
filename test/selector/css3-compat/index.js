'use strict';
var fs = require('fs');
var browser = require('../../../');
var eachCssStyleRule = require('../../../src/style/each-css-style-rule');
var assert = require('assert');

describe('css3-compat', function() {
    var baseURI = __dirname + '/css3-compat.html';
    var html = fs.readFileSync(baseURI, 'utf8');
    var window = browser.sync(html, {
        baseURI: baseURI,
        loadCssFile: false
    });

    var document = window.document;
    window.location.hash = '#target';

    eachCssStyleRule(document, function(cssRule) {
        var selectorText = cssRule.selectorText;
        it(selectorText, function() {
            var elements = document.querySelectorAll(selectorText);
            assert.equal(true, elements.length > 0);
        });
    });
});