'use strict';
var fs = require('fs');
var browser = require('../../../');
var eachCssStyleRule = require('../../../src/style/each-css-style-rule');
var assert = require('assert');

describe('css3-compat', function() {
    describe('querySelectorAll', function() {

        var html = fs.readFileSync(__dirname + '/css3-compat.html', 'utf8');
        var window = browser.sync(html, {
            url: __dirname + '/css3-compat.html',
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
});