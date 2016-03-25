'use strict';

var browser = require('../../');
var assert = require('assert');

describe('Document', function() {

    var baseURI = 'http://font-spider.org';
    var html = '<!DOCTYPE html>' +
        '<html lang="en">' +
        '<head>' +
        '<meta charset="UTF-8">' +
        '<title>Document</title>' +
        '</head>' +
        '<body></body>' +
        '</html>';

    var window = browser.sync(html, {
        baseURI: baseURI + '/index.html',
        loadCssFile: false
    });
    var document = window.document;

    it('#nodeName', function() {
        assert.equal('#document', window.document.nodeName);
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
            assert.equal(baseURI + '/doc.html', a.href);
        });
    });

});