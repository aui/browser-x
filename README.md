# BrowserX

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Node.js Version][node-version-image]][node-version-url]
[![Build Status][travis-ci-image]][travis-ci-url]

BrowserX 是一个基于 NodeJS 实现的轻量级“浏览器”，它的目标是高效的实现 DOM 中最核心的特性，以便开发者能够在 NodeJS 中使用 W3C 标准方法来操作文档与样式。

* 提供 DOM 核心核心
* 完整支持 CSS3 选择器来查询节点
* 支持样式解析，如 `element.style`、`document.styleSheets`、`window.getComputedStyle()` 以及 CSSOM 相关构造器访问

## 安装

``` shell
npm install browser-x
```

## 接口

### browser(options, callback)

返回：`Promise`

``` javascript
var browser = require('browser-x');

var url = __dirname + '/debug.html';
browser({
    url: url,
    loadCssFile: true,
    silent: false
}, function (errors, window) {
    if (errors) {
        throw errors;
    }
    var document = window.document;
    var element = document.querySelector('#banner h2');
    var fontFamily = window.getComputedStyle(element, '::after').fontFamily;
    console.log(fontFamily);
});
```

## options

``` javascript
{
    /**
     * 文件基础路径 - 支持本地或远程地址
     */
    url: 'about:blank',

    /*
     * HTML 文本内容
     */
    html: null,

    /**
     * 是否支持加载外部 CSS 文件
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
     * @return  {Object}
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
    resourceIgnore: function(file) {
        return false;
    },

    /**
     * 资源加载前的事件
     * @param   {String}    文件地址
     */
    resourceBeforeLoad: function(file) {
    },

    /**
     * 加载远程资源的自定义请求头
     * @param   {String}    文件地址
     * @return  {Object}
     */
    resourceRequestHeaders: function(file) {
        return {
            'accept-encoding': 'gzip,deflate'
        };
    }
}
```

## 支持的 DOM API

* Window
    - [getComputedStyle()](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/getComputedStyle)
    - [CSSStyleDeclaration()](https://developer.mozilla.org/zh-CN/docs/Web/API/CSSStyleDeclaration)
    - [CSSRule()](https://developer.mozilla.org/zh-CN/docs/Web/API/CSSRule)
    - [CSSStyleRule()](https://developer.mozilla.org/zh-CN/docs/Web/API/CSSStyleRule)
    - [MediaList()](https://developer.mozilla.org/zh-CN/docs/Web/API/MediaList)
    - [CSSMediaRule()](https://developer.mozilla.org/zh-CN/docs/Web/API/CSSMediaRule)
    - [CSSImportRule()](https://developer.mozilla.org/zh-CN/docs/Web/API/CSSImportRule)
    - [CSSFontFaceRule()](https://developer.mozilla.org/zh-CN/docs/Web/API/CSSFontFaceRule)
    - [StyleSheet()](https://developer.mozilla.org/zh-CN/docs/Web/API/StyleSheet)
    - [CSSStyleSheet()](https://developer.mozilla.org/zh-CN/docs/Web/API/CSSStyleSheet)
    - [CSSKeyframesRule()](https://developer.mozilla.org/zh-CN/docs/Web/API/CSSKeyframesRule)
    - [CSSKeyframeRule()](https://developer.mozilla.org/zh-CN/docs/Web/API/CSSKeyframeRule)
* Document
    - [URL](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/URL)
    - [documentElement](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/documentElement)
    - [head](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/head)
    - [body](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/body)
    - [title](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/title)
    - [styleSheets](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/styleSheets)
    - [getElementsByTagName()](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/getElementsByTagName)
    - [getElementById()](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/getElementById)
    - [querySelector()](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/querySelector)
    - [querySelectorAll()](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/querySelectorAll)
* Element
    - [id](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/id)
    - [tagName](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/tagName)
    - [className](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/className)
    - [innerHTML](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/innerHTML)
    - [outerHTML](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/outerHTML)
    - [attributes](https://developer.mozilla.org/zh-CN/docs/Web/API/Node.attributes)
    - [hasAttribute()](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/hasAttribute)
    - [getAttribute()](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getAttribute)
    - [querySelector()](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/querySelector)
    - [querySelectorAll()](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/querySelectorAll)
    - [getElementsByTagName()](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getElementsByTagName)
    - [matches()](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/matches)
* HTMLElement
    - [style](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/style)
* Node
    - [nodeName](https://developer.mozilla.org/zh-CN/docs/Web/API/Node.nodeName)
    - [nodeType](https://developer.mozilla.org/zh-CN/docs/Web/API/Node.nodeType)
    - [childNodes](https://developer.mozilla.org/zh-CN/docs/Web/API/Node.childNodes)
    - [parentNode](https://developer.mozilla.org/zh-CN/docs/Web/API/Node.parentNode)
    - [firstChild](https://developer.mozilla.org/zh-CN/docs/Web/API/Node.firstChild)
    - [lastChild](https://developer.mozilla.org/zh-CN/docs/Web/API/Node.lastChild)
    - [nextSibling](https://developer.mozilla.org/zh-CN/docs/Web/API/Node.nextSibling)
    - [previousSibling](https://developer.mozilla.org/zh-CN/docs/Web/API/Node.previousSibling)
    - [textContent](https://developer.mozilla.org/zh-CN/docs/Web/API/Node.textContent)
    - [baseURI](https://developer.mozilla.org/zh-CN/docs/Web/API/Node.baseURI)

## 注意事项

1. 不支持 XML 文档解析 
2. 所有的 DOM 属性均为只读（*计划在未来版本支持写入*）
3. window.getComputedStyle() 仅能获取元素或伪元素在 CSS 中定义的原始值或继承属性，但没有进行计算输出（例如 em \> px）
4. document.styleSheets 在浏览器中无法跨域访问 CSSOM，BrowserX 没有做此限制（外部样式需要打开 `loadCssFile` 选项）
5. 不支持浏览器怪异模式

## 为什么使用 BrowserX

BrowserX 适合做这些事情：

1. 高效的爬虫程序，使用 CSS 选择器来收集内容
2. 分析元素的样式使用情况，例如和 CSS 相关的开发工具

例如：WebFont 压缩工具——[font-spider](https://github.com/aui/font-spider)

如果需要更多的 DOM 特性，例如跑基于 DOM 的测试脚本、甚至载入 jQuery 等，那么 [jsdom](https://github.com/tmpvar/jsdom) 这个项目可能会更适合你（注意：它没有完整解析样式表）。


[npm-image]: https://img.shields.io/npm/v/browser-x.svg
[npm-url]: https://npmjs.org/package/browser-x
[node-version-image]: https://img.shields.io/node/v/browser-x.svg
[node-version-url]: http://nodejs.org/download/
[downloads-image]: https://img.shields.io/npm/dm/browser-x.svg
[downloads-url]: https://npmjs.org/package/browser-x
[travis-ci-image]: https://travis-ci.org/aui/browser-x.svg?branch=master
[travis-ci-url]: https://travis-ci.org/aui/browser-x