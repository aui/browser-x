'use strict';

var Resource = require('../../src/utils/resource');
var assert = require('assert');

describe('Resource', function() {
    var resource = new Resource({
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
                throw new Error('');
            }, function() {
                done();
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