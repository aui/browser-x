'use strict';
var fs = require('fs');
var browser = require('../../');
var assert = require('assert');



describe('getComputedStyle', function() {
    describe('getComputedStyle(node, pseudo)', function() {

        describe('pseudo1.html', function() {
            var baseURI = __dirname + '/html/pseudo1.html';
            var html = fs.readFileSync(baseURI, 'utf8');

            var window = browser.sync(html, {
                baseURI: baseURI,
                loadCssFile: false
            });

            var document = window.document;
            var getComputedStyle = window.getComputedStyle;

            it('#test1::after', function() {
                var node = document.querySelector('#test1');
                var style = getComputedStyle(node, '::after');
                assert.equal('\'hello world\'', style.content);

                style = getComputedStyle(node, ':after');
                assert.equal('\'hello world\'', style.content);
            });

            it('#test2:after', function() {
                var node = document.querySelector('#test2');
                var style = getComputedStyle(node, ':after');
                assert.equal('\'hello world\'', style.content);

                style = getComputedStyle(node, '::after');
                assert.equal('\'hello world\'', style.content);
            });

            it('#test3::AFTER', function() {
                var node = document.querySelector('#test3');
                var style = getComputedStyle(node, ':after');
                assert.equal('\'hello world\'', style.content);

                style = getComputedStyle(node, '::after');
                assert.equal('\'hello world\'', style.content);

                style = getComputedStyle(node, ':AFTER');
                assert.equal('\'hello world\'', style.content);

                style = getComputedStyle(node, '::AFTER');
                assert.equal('\'hello world\'', style.content);

            });
        });

        describe('pseudo2.html', function() {
            var baseURI = __dirname + '/html/pseudo2.html';
            var html = fs.readFileSync(baseURI, 'utf8');

            var window = browser.sync(html, {
                baseURI: baseURI,
                loadCssFile: false
            });

            var document = window.document;
            var getComputedStyle = window.getComputedStyle;

            it('*::after', function() {
                var node = document.querySelector('body');
                var style = getComputedStyle(node, '::after');
                assert.equal('\'hello world\'', style.content);
            });

            it('*:after', function() {
                var node = document.querySelector('body');
                var style = getComputedStyle(node, ':after');
                assert.equal('\'hello world\'', style.content);
            });
        });

        describe('pseudo3.html', function() {
            var baseURI = __dirname + '/html/pseudo3.html';
            var html = fs.readFileSync(baseURI, 'utf8');

            var window = browser.sync(html, {
                baseURI: baseURI,
                loadCssFile: false
            });

            var document = window.document;
            var getComputedStyle = window.getComputedStyle;

            it('*::after', function() {
                var node = document.querySelector('body');
                var style = getComputedStyle(node, '::after');
                assert.equal('\'hello world\'', style.content);
            });

            it('*:after', function() {
                var node = document.querySelector('body');
                var style = getComputedStyle(node, ':after');
                assert.equal('\'hello world\'', style.content);
            });
        });

        describe('pseudo4.html', function() {
            var baseURI = __dirname + '/html/pseudo4.html';
            var html = fs.readFileSync(baseURI, 'utf8');

            var window = browser.sync(html, {
                baseURI: baseURI,
                loadCssFile: false
            });

            var document = window.document;
            var getComputedStyle = window.getComputedStyle;

            it('::after', function() {
                var node = document.querySelector('body');
                var style = getComputedStyle(node, '::after');
                assert.equal('\'hello world\'', style.content);
            });

            it(':after', function() {
                var node = document.querySelector('body');
                var style = getComputedStyle(node, ':after');

                assert.equal('\'hello world\'', style.content);
            });
        });

        describe('pseudo5.html', function() {
            var baseURI = __dirname + '/html/pseudo5.html';
            var html = fs.readFileSync(baseURI, 'utf8');

            var window = browser.sync(html, {
                baseURI: baseURI,
                loadCssFile: false
            });

            var document = window.document;
            var getComputedStyle = window.getComputedStyle;

            it('::after', function() {
                var node = document.querySelector('body');
                var style = getComputedStyle(node, '::after');
                assert.equal('\'hello world\'', style.content);
            });

            it(':after', function() {
                var node = document.querySelector('body');
                var style = getComputedStyle(node, ':after');
                assert.equal('\'hello world\'', style.content);
            });
        });

        // 测试继承属性
        describe('pseudo6.html', function() {
            var baseURI = __dirname + '/html/pseudo6.html';
            var html = fs.readFileSync(baseURI, 'utf8');

            var window = browser.sync(html, {
                baseURI: baseURI,
                loadCssFile: false
            });

            var document = window.document;
            var getComputedStyle = window.getComputedStyle;

            it('#test1::after', function() {
                var node = document.querySelector('#test1');
                var style = getComputedStyle(node, '::after');
                assert.equal('aaa', style.fontFamily);
            });

            it('#test2::after', function() {
                var node = document.querySelector('#test2');
                var style = getComputedStyle(node, '::after');
                assert.equal('bbb', style.fontFamily);
            });

            it('#test3::after', function() {
                var node = document.querySelector('#test3');
                var style = getComputedStyle(node, '::after');
                assert.equal('ccc', style.fontFamily);
            });
        });

    });
});