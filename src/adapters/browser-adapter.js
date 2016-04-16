'use strict';

function BrowserAdapter(options) {

    options = options || {};

    if (options instanceof BrowserAdapter) {
        return options;
    }

    for (var key in options) {
        this[key] = options[key];
    }
}

BrowserAdapter.prototype = {

    constructor: BrowserAdapter,

    /**
     * 文件基础路径 - 支持本地或远程地址
     * @type    {String}
     */
    url: 'about:blank',

    /*
     * HTML 内容
     * @type    {String}
     */
    html: null,

    /**
     * 是否支持加载外部 CSS 文件
     * @type    {Boolean}
     */
    loadCssFile: false,

    /**
     * 是否忽略内部解析错误-关闭它有利于开发调试
     * @type    {Boolean}
     */
    silent: true,

    /**
     * 请求超时限制
     * @type    {Number}    毫秒
     */
    resourceTimeout: 8000,

    /**
     * 最大的文件加载数量限制
     * @type    {Number}    数量
     */
    resourceMaxNumber: 64,

    /**
     * 是否缓存请求成功的资源
     * @type    {Boolean}
     */
    resourceCache: true,

    /**
     * 映射资源路径
     * @param   {String}    旧文件地址
     * @return  {String}    新文件地址
     */
    resourceMap: function(file) {
        return file;
    },

    /**
     * 忽略资源
     * @param   {String}    文件地址
     * @return  {Boolean}   如果返回`true`则忽略当当前文件的加载
     */
    resourceIgnore: function(file) {// jshint ignore:line
        return false;
    },

    /**
     * 资源加载前的事件
     * @param   {String}    文件地址
     */
    resourceBeforeLoad: function(file) {// jshint ignore:line
    },

    /**
     * 加载远程资源的自定义请求头
     * @param   {String}    文件地址
     * @return  {Object}
     */
    resourceRequestHeaders: function(file) {// jshint ignore:line
        return {
            'accept-encoding': 'gzip,deflate'
        };
    }
};


module.exports = BrowserAdapter;