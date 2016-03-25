// TODO 超时配置参数
'use strict';

var fs = require('fs');
var http = require('http');
var https = require('https');
var url = require('url');
var zlib = require('zlib');
var utils = require('./utils');
var VError = require('verror');



function Resource(options) {
    options = utils.options(Resource.defaults, options);
    this.options = options;
    this.cache = {};
}


Resource.prototype.get = function(file) {

    file = utils.normalize(file);

    var resource;
    var options = this.options;
    var resourceCache = options.resourceCache;
    var that = this;

    options.resourceBeforeLoad(file);

    if (resourceCache) {
        resource = this.cache[file];
        if (resource) {
            return resource;
        }
    }

    resource = new Promise(function(resolve, reject) {

        if (utils.isRemoteFile(file)) {
            that.loadRemoteFile(file, onload);
        } else {
            that.loadLocalFile(file, onload);
        }

        function onload(errors, data) {
            if (errors) {
                reject(errors);
            } else {
                resolve(data);
            }
        }

    });


    resource.catch(function(errors) {
        errors = new VError(errors, 'ENOENT, load "%s" failed', file);
        return Promise.reject(errors);
    });


    if (resourceCache) {
        this.cache[file] = resource;
    }

    return resource;
};



Resource.prototype.loadLocalFile = function(file, callback) {
    fs.readFile(file, 'utf8', callback);
};


Resource.prototype.loadRemoteFile = function(file, callback) {

    file = this.options.resourceMap(file);

    var location = url.parse(file);
    var protocol = location.protocol === 'http:' ? http : https;

    var request = protocol.request({
            method: 'GET',
            host: location.host,
            hostname: location.hostname,
            path: location.path,
            port: location.port,
            headers: {
                'accept-encoding': 'gzip,deflate'
            }
        }, function(res) {

            var encoding = res.headers['content-encoding'];
            var type = res.headers['content-type'];
            var errors = null;


            if (!/2\d\d/.test(res.statusCode)) {
                errors = new Error(res.statusMessage);
            } else if (type.indexOf('text/') !== 0) {
                errors = new Error('only supports `text/*` resources');
            }


            if (errors) {
                callback(errors);
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
                                callback(errors);
                            } else {
                                callback(null, buffer.toString());
                            }
                        });

                    } else if (encoding == 'deflate') {

                        zlib.inflate(buffer, function(errors, decoded) {
                            if (errors) {
                                callback(errors);
                            } else {
                                callback(null, decoded.toString());
                            }
                        });

                    } else {
                        callback(null, buffer.toString());
                    }

                });

            }

        })
        .on('error', callback);

    request.end();

};

/*
 * 默认选项
 */
Resource.defaults = {
    resourceCache: false,
    resourceMap: function(url) {
        return url;
    },
    resourceBeforeLoad: function() {}
};



module.exports = Resource;