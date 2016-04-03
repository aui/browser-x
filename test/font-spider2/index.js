'use strict';
var FontSpider = require('./font-spider');
var Adapter = require('./adapter');

module.exports = function createFontSpider(htmlFiles, options, callback) {


    if (!Array.isArray(htmlFiles)) {
        htmlFiles = [htmlFiles];
    }

    callback = callback || function() {};


    var adapter = new Adapter(options);
    var queue = htmlFiles.map(function(htmlFile) {
        return new FontSpider(htmlFile, adapter);
    });

    return Promise.all(queue).then(function(webFonts) {

        webFonts = reduce(webFonts);

        var list = [];
        var indexs = {};


        // 合并相同 font-face 的查询数据
        webFonts.forEach(function(webFont) {
            var id = webFont.id;
            if (typeof indexs[id] === 'number') {
                var item = list[indexs[id]];
                item.chars += webFont.chars;
                item.selectors = item.selectors.concat(webFont.selectors);
                item.files = item.files.filter(function(file) {
                    return adapter.resourceIgnore(file.source);
                });
            } else {
                indexs[id] = list.length;
                list.push(webFont);
            }

            delete webFont._elements;
        });



        // 处理 chars 字段
        list.forEach(function(font) {

            var chars = font.chars.split('');

            // 对字符进行除重操作
            if (adapter.unique) {
                chars = unique(chars);
            }

            // 对字符按照编码进行排序
            if (adapter.sort) {
                chars.sort(sort);
            }

            // 删除无用字符
            chars = chars.join('').replace(/[\n\r\t]/g, '');

            font.chars = chars;
        });


        process.nextTick(function() {
            callback(null, list);
        });

        return list;
    }, function(errors) {
        process.nextTick(function() {
            callback(errors);
        });
        return Promise.reject(errors);
    });



    // 扁平化二维数组
    function reduce(array) {
        var ret = [];

        array.forEach(function(item) {
            ret.push.apply(ret, item);
        });

        return ret;
    }


    function sort(a, b) {
        return a.charCodeAt() - b.charCodeAt();
    }


    function unique(array) {
        var ret = [];

        array.forEach(function(val) {
            if (ret.indexOf(val) === -1) {
                ret.push(val);
            }
        });

        return ret;
    }

};
