# browser-x

这是一个基于 NodeJS 简版浏览器实现。拥有完整的 CSS3 选择器支持以及核心 DOM 方法，并且能够解析样式，支持`window.getComputedStyle(element, pseudo)`方法。

* 快速的 CSS3 选择器引擎
* DOM 树的属性均只读

## browser()

```javascript
var browser = require('browser-x');

var baseURI = __dirname + '/debug.html';
var html = fs.readFileSync(baseURI, 'utf8');
browser(html, {
    baseURI: baseURI,
    loadCssFile: true,
    silent: true
}, function (errors, window) {
    if (errors) {
        throw errors;
    }
    var document = window.document;
    var element = document.querySelector('#banner h2');
    var fontFamily = window.getComputedStyle(element).fontFamily;
    console.log(fontFamily);
});
```

## browser.open()

```javascript
var browser = require('browser-x');

browser.open('http://font-spider.org', {
    loadCssFile: true,
    silent: true
}, function (errors, window) {
    if (errors) {
        throw errors;
    }
    console.log(window.document.title);
});
```

## 测试

```shell
npm test
```

## 为什么使用 browser-x

browser-x 适合做这些事情：

1. 实现爬虫
2. 分析元素的样式使用情况，例如和 CSS 相关的开发工具

如果需要更多的 DOM 特性，例如跑基于 DOM 的测试脚本，那么 [jsdom](https://github.com/tmpvar/jsdom) 这个项目可能会更适合你（CSS 非完整支持）。
