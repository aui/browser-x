'use strict';

var browser = require('../../');
var assert = require('assert');
var fs = require('fs');
var path = require('path');


describe('Document', function() {

    var baseURI = __dirname + '/html/blank.html';
    var html = fs.readFileSync(baseURI, 'utf8');

    var window = browser.sync(html, {
        baseURI: baseURI,
        loadCssFile: false
    });

    var document = window.document;


    it('document', function() {
        assert.equal('object', typeof document);
    });

    it('document.documentElement', function() {
        assert.equal('HTML', document.documentElement.nodeName);
    });

    it('document.head', function() {
        assert.equal('HEAD', document.head.nodeName);
    });

    it('document.body', function() {
        assert.equal('BODY', document.body.nodeName);
    });

    it('document.nodeName', function() {
        assert.equal('#document', document.nodeName);
    });

    it('document.title', function() {
        assert.equal('Document', document.title);
    });

    it('document.styleSheets', function() {
        assert.equal('object', typeof document.styleSheets);
        assert.equal(0, document.styleSheets.length);
    });

    it('document.baseURI', function() {
        assert.equal(baseURI, document.baseURI);
    });

    describe('#createElement()', function() {

        it('document.createElement("div")', function() {
            var div = document.createElement('div');
            assert.equal('DIV', div.nodeName);
            assert.equal(false, !!div.parentNode);
        });

        it('document.createElement("DIV")', function() {
            var div = document.createElement('DIV');
            assert.equal('DIV', div.nodeName);
        });

        it('document.createElement("a")', function() {
            var a = document.createElement('a');
            a.setAttribute('href', 'doc.html');

            assert.equal('A', a.nodeName);
            assert.equal(path.dirname(baseURI) + '/doc.html', a.href);
        });
    });

    describe('#getElementById()', function() {
        it('document.getElementById("sDksf")', function() {
            assert.equal(null, document.getElementById("sDksf"));
        });
    });

    describe('#getElementsByTagName()', function() {
        it('document.getElementsByTagName("body")', function() {
            assert.equal(1, document.getElementsByTagName("body").length);
        });
    });

    describe('#querySelector()', function() {
        it('document.querySelector("body")', function() {
            assert.equal('BODY', document.querySelector("body").nodeName);
        });
    });

    describe('#querySelectorAll()', function() {
        it('document.querySelectorAll("*")', function() {
            assert.equal(5, document.querySelectorAll("*").length);
        });
    });

});

describe('Element', function() {

    var baseURI = __dirname + '/html/test.html';
    var html = fs.readFileSync(baseURI, 'utf8');

    var window = browser.sync(html, {
        baseURI: baseURI,
        loadCssFile: false
    });

    var document = window.document;


    it('element.id', function() {
        assert.equal('', document.head.id);
        assert.equal('', document.body.id);
        assert.equal('div', document.getElementById('div').id);
        assert.equal('DIV2', document.getElementById('DIV2').id);
    });

    it('element.nodeName', function() {
        assert.equal('HTML', document.documentElement.nodeName);
        assert.equal('DIV', document.getElementById('DIV2').nodeName);
    });

    it('element.tagName', function() {
        assert.equal('HTML', document.documentElement.tagName);
        assert.equal('DIV', document.getElementById('DIV2').tagName);
    });

    it('element.baseURI', function() {
        assert.equal('htts://www.font-spider.org:80/', document.documentElement.baseURI);
    });

    it('element.innerHTML', function() {
        assert.equal('.test::after{content:\'<>\'}', document.getElementById('style').innerHTML);
        assert.equal('<em>h1</em>', document.getElementById('h1').innerHTML);
        assert.equal('&lt;code&gt;...&lt;/code&gt;', document.getElementById('textarea').innerHTML);
        assert.equal('<!-- hello -->console.log(\'<>\')', document.getElementById('script').innerHTML);
    });

    it('element.outerHTML', function() {
        assert.equal('<style id="style">.test::after{content:\'<>\'}</style>', document.getElementById('style').outerHTML);
        assert.equal('<h1 id="h1"><em>h1</em></h1>', document.getElementById('h1').outerHTML);
        assert.equal('<textarea name="textarea" id="textarea" cols="30" rows="10">&lt;code&gt;...&lt;/code&gt;</textarea>', document.getElementById('textarea').outerHTML);
        assert.equal('<script id="script"><!-- hello -->console.log(\'<>\')</script>', document.getElementById('script').outerHTML);
    });


    describe('HTMLAnchorElement', function() {
        it('element.href', function() {
            assert.equal('htts://www.font-spider.org:80/api/test.html?id=1#title', document.getElementById('a').href);
        });
    });


    describe('HTMLInputElement', function() {
        it('element.type', function() {
            assert.equal('text', document.getElementById('input').type);
            assert.equal('checkbox', document.getElementById('checkbox').type);
        });
        it('element.disabled', function() {
            assert.equal(true, document.getElementById('input').disabled);
            assert.equal(true, document.getElementById('radio').disabled);
            assert.equal(false, document.getElementById('checkbox').disabled);
        });
    });

});