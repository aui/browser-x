'use strict';

var Resource = require('../../src/utils/resource');
var assert = require('assert');

describe('Resource', function() {
    var resource = new Resource({
        resourceTimeout: 500,
        resourceCache: function() {
            if (!this._resourceCache) {
                this._resourceCache = {};
            }

            return this._resourceCache;
        },
        resourceIgnore: function(file) {
            if (/\.js$/i.test(file)) {
                return true;
            } else {
                return false;
            }
        },
        resourceMap: function(file) {
            file = file.replace('https://file.google.com/', __dirname + '/file/')
            return file;
        },
        resourceBeforeLoad: function() {}
    });

    describe('#get', function() {

        it('get file', function() {
            return resource.get(__dirname + '/file/test.txt').then(function(data) {
                if (data !== 'hello world') {
                    throw new Error('No data');
                }
            });
        });

        it('file not found', function(done) {
            resource.get(__dirname + '/file/404.html').then(function(data) {
                throw new Error('success');
            }, function(errors) {
                if (errors.path === __dirname + '/file/404.html') {
                    done();
                } else {
                    throw new Error('errors.path');
                }
            });
        });

        it('file not found[http]', function(done) {
            resource.get('http://facebook/404/404').then(function(data) {
                throw new Error('success');
            }, function(errors) {
                if (errors.path === 'http://facebook/404/404') {
                    done();
                } else {
                    throw new Error('errors.path');
                }
            });
        });

        it('adapter: resourceIgnore', function() {
            return resource.get(__dirname + '/file/test.js').then(function(data) {
                if (data !== '') {
                    throw new Error('Adapter: resourceIgnore');
                }
            });
        });

        it('adapter: resourceMap', function() {
            return resource.get('https://file.google.com/test.txt').then(function(data) {
                if (data !== 'hello world') {
                    throw new Error('No data');
                }
            });
        });

    });



});