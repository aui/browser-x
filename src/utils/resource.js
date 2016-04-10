'use strict';

var fs = require('fs');
var http = require('http');
var https = require('https');
var url = require('url');
var path = require('path');
var zlib = require('zlib');
var VError = require('verror');

var BrowserAdapter = require('../adapters/browser-adapter');



function Resource(adapter) {
    this.adapter = new BrowserAdapter(adapter);
    this.number = 0;
    this.cache = {};
}

Resource.prototype = {

    constructor: Resource,

    /**
     * 加载本地或远程资源
     * @param   {String}    路径
     * @return  {Promise}
     */
    get: function(file) {
        this.number++;

        var resource;
        var adapter = this.adapter;
        var resourceCache = adapter.resourceCache;
        var that = this;

        // ignore > map > normalize
        if (adapter.resourceIgnore(file)) {
            return Promise.resolve('');
        }
        file = adapter.resourceMap(file);
        file = this.normalize(file);

        if (this.number > this.adapter.resourceMaxNumber) {
            var errors = new Error('Exceed the maximum load limit on the number of resources');
            errors = new Resource.Error(errors, file);
            return Promise.reject(errors);
        }

        adapter.resourceBeforeLoad(file);

        if (resourceCache && this.cache[file]) {
            resource = this.cache[file];
            if (resource) {
                return resource;
            }
        }


        resource = new Promise(function(resolve, reject) {

            if (that.isRemoteFile(file)) {
                that.loadRemoteFile(file, onload);
            } else {
                that.loadLocalFile(file, onload);
            }

            function onload(errors, data) {
                if (errors) {
                    errors = new Resource.Error(errors, file);
                    reject(errors);
                } else {
                    resolve(data.toString());
                }
            }

        });


        if (resourceCache) {
            this.cache[file] = resource;
        }

        return resource;
    },

    /**
     * 加载本地资源
     * @param   {String}    路径
     * @param  {String}    回调
     */
    loadLocalFile: function(file, callback) {
        fs.readFile(file, 'utf8', callback);
    },


    /**
     * 加载远程资源
     * @param   {String}    路径
     * @param  {String}    回调
     */
    loadRemoteFile: function(file, callback) {
        var number = arguments[2] || 0;
        var location = url.parse(file);
        var protocol = location.protocol === 'http:' ? http : https;
        var timeoutEventId;
        var that = this;
        var REDIRECTION_MAX = 3;

        var done = function(errors, data) {
            clearTimeout(timeoutEventId);
            callback(errors, data);
        }


        var request = protocol.request({
                method: 'GET',
                host: location.host,
                hostname: location.hostname,
                path: location.path,
                port: location.port,
                headers: this.adapter.resourceRequestHeaders(file)
            }, function(res) {

                var encoding = res.headers['content-encoding'];
                var type = res.headers['content-type'];
                var statusCode = res.statusCode;
                var errors = null;

                if (/3\d\d/.test(statusCode) && res.headers.location && number < REDIRECTION_MAX) {
                    clearTimeout(timeoutEventId);
                    var file = res.headers.location;
                    number++;
                    that.loadRemoteFile(file, callback, number);
                    return;
                } else if (!/2\d\d/.test(statusCode)) {
                    errors = new Error(res.statusMessage);
                }

                if (type.indexOf('text/') !== 0) {
                    errors = new Error('only supports `text/*` resources');
                }


                if (errors) {
                    done(errors);
                } else {

                    var buffer = new Buffer([]);


                    if (encoding === 'undefined') {
                        res.setEncoding('utf-8');
                    }


                    res.on('data', function(chunk) {
                        buffer = Buffer.concat([buffer, chunk]);
                    });

                    res.on('end', function() {

                        if (encoding === 'gzip') {

                            zlib.unzip(buffer, function(errors, buffer) {
                                if (errors) {
                                    done(errors);
                                } else {
                                    done(null, buffer);
                                }
                            });

                        } else if (encoding == 'deflate') {

                            zlib.inflate(buffer, function(errors, decoded) {
                                if (errors) {
                                    done(errors);
                                } else {
                                    done(null, decoded);
                                }
                            });

                        } else {
                            done(null, buffer);
                        }

                    });

                }

            })
            .on('error', done)
            .on('timeout', function(errors) {
                request.abort();
                done(errors);
            });


        timeoutEventId = setTimeout(function() {
            request.emit('timeout', new Error('have been timeout'));
        }, this.adapter.resourceTimeout);


        request.end();

    },

    /**
     * 标准化路径
     * @param   {String}    路径
     * @return  {String}    标准化路径
     */
    normalize: function(src) {

        if (!src) {
            return src;
        }

        if (this.isRemoteFile(src)) {
            // http://font/font?name=xxx#x
            // http://font/font?
            return src.replace(/#.*$/, '').replace(/\?$/, '');
        } else {
            // ../font/font.eot?#font-spider
            src = src.replace(/[#?].*$/g, '');
            return path.normalize(src);
        }
    },


    /**
     * 判断是否为远程 URL
     * @param   {String}     路径
     * @return  {Boolean}
     */
    isRemoteFile: function(src) {
        var RE_SERVER = /^https?\:\/\//i;
        return RE_SERVER.test(src);
    }
};


Resource.Error = ResourceError;

function ResourceError(errors, file) {
    VError.call(this, new VError(errors, 'ENOENT, load "%s" failed', file));

    if (!this.path) {
        this.path = file;
    }
}
ResourceError.prototype = Object.create(VError.prototype);
ResourceError.prototype.constructor = ResourceError;


module.exports = Resource;