'use strict';

var browser = require('../../');
var assert = require('assert');

describe('Document', function() {

    var html = '<!DOCTYPE html>' +
        '<html lang="en">' +
        '<head>' +
        '<meta charset="UTF-8">' +
        '<title>Document</title>' +
        '</head>' +
        '<body></body>' +
        '</html>';


    it('#nodeName', function() {
        return browser(html).then(function(window) {
            assert.equal('#document', window.document.nodeName);
        });
    });


    describe('#createElement()', function() {
        it('创建元素', function() {
            return browser(html).then(function(window) {
                var document = window.document;
                var div = document.createElement('div');

                div.setAttribute('id', 'test');
                assert.equal('test', div.getAttribute('id'));
            });

        });
    });


    describe('#documentElement, #head, #body', function() {
        it('节点', function() {
            return browser(html).then(function(window) {
                var document = window.document;
                assert.equal('HTML', document.documentElement.nodeName);
                assert.equal('HEAD', document.head.nodeName);
                assert.equal('BODY', document.body.nodeName);
            });
        });
    });

});