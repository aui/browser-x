'use strict';
var fs = require('fs');
var browser = require('../../../');
var eachCssStyleRule = require('../../../src/style/each-css-style-rule');
var assert = require('assert');

describe('css3-compat', function() {
    it('querySelectorAll', function() {
        var html = fs.readFileSync(__dirname + '/css3-compat.html', 'utf8');

        return browser(html, {
            url: __dirname + '/css3-compat.html',
            loadCssFile: true
        }).then(function(window) {
            var document = window.document;
            //console.log(window.location.hash, 'window.location.hash')

            window.location.hash = '#target';

            eachCssStyleRule(document, function(cssRule) {
                var selectorText = cssRule.selectorText;
                var elements = querySelectorAll(selectorText);
                assert.equal(true, elements.length > 0);
            });

            function querySelectorAll(selectorText) {
                try {
                    var elements = document.querySelectorAll(selectorText);

                    if (elements.length === 0) {
                        throw new Error('Unsupported selector: ' + selectorText);
                    }

                    return elements;
                } catch(e) {
                    console.error(selectorText);
                    console.error(e.stack);
                    return [];
                }
            }
        });
    });
});