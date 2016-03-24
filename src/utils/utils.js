'use strict';

var path = require('path');


// http://font-spider.org/css/style.css
var RE_SERVER = /^https?\:\/\//i;



/*
 * 浅拷贝（包括原型属性）
 * @param   {Object}    目标对象
 * @param   {Object}    混合进来的对象
 */
function mix(target, object) {
    for (var key in object) {
        target[key] = object[key];
    }
    return target;
}


/*
 * 混合配置
 * @param   {Object}    默认配置
 * @param   {Object}    被加入的配置
 */
function options(defaults, config) {
    return mix(Object.create(defaults), config || {});
}


/*
 * 标准化路径
 * @param   {String}    路径
 * @return  {String}    标准化路径
 */
function normalize(src) {

    if (!src) {
        return src;
    }

    if (isRemoteFile(src)) {
        // http://font/font?name=xxx#x
        // http://font/font?
        return src.replace(/#.*$/, '').replace(/\?$/, '');
    } else {
        // ../font/font.eot?#font-spider
        src = src.replace(/[#?].*$/g, '');
        return path.normalize(src);
    }
}


/*
 * 判断是否为远程 URL
 * @param   {String}     路径
 * @return  {Boolean}
 */
function isRemoteFile(src) {
    return RE_SERVER.test(src);
}



module.exports = {
    mix: mix,
    options: options,
    normalize: normalize,
    isRemoteFile: isRemoteFile
};