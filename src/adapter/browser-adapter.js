'use strict';

function BrowserAdapter(options) {

    if (options instanceof BrowserAdapter) {
        return options;
    }

    options = options || {};
    Object.keys(options).forEach(function(key) {
        var value = options[key];
        this[key] = value;
    }, this);

    this._resourceCache = {};
}

BrowserAdapter.prototype = {

    constructor: BrowserAdapter,

    /**
     * 文件基础路径
     */
    baseURI: 'about:blank',

    /**
     * 是否支持加载外部 CSS 文件
     */
    loadCssFile: false,

    /**
     * 获取缓存
     * @return  {Object}
     */
    resourceCache: function() {
        return this._resourceCache;
    },

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
    }
};


module.exports = BrowserAdapter;