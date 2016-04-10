# browser-x

browser-x 一个基于 NodeJS 实现的“浏览器”，它实现 W3C 核心 API，适用于文档或样式节点分析：

* 使用 CSS3 选择器来操作 DOM
* 分析 CSS 在文档中的应用情况

## 安装

```shell
npm install browser-x
```

## 接口

### browser(options, callback)

```javascript
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

```
{
    /**
     * 文件基础路径
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
     * 解析时是否静默失败
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
     * @tyoe    {Number}    数量
     */
    resourceMaxNumber: 64,

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

## 运行单元测试

```shell
npm test
```

## 支持的 DOM API

* window.getComputedStyle()
* window.CSSStyleDeclaration()
* window.CSSRule()
* window.CSSStyleRule()
* window.MediaList()
* window.CSSMediaRule()
* window.CSSImportRule()
* window.CSSFontFaceRule()
* window.StyleSheet()
* window.CSSStyleSheet()
* window.CSSKeyframesRule()
* window.CSSKeyframeRule()
* window.MatcherList()
* window.CSSDocumentRule()
* window.CSSValue()
* window.CSSValueExpression()
* document.URL
* document.baseURI
* document.documentElement
* document.head
* document.body
* document.title
* document.styleSheets
* document.getElementsByTagName()
* document.getElementById()
* document.querySelector()
* document.querySelectorAll()
* element.id
* element.tagName
* element.style
* element.className
* element.innerHTML
* element.outerHTML
* element.hasAttribute()
* element.getAttribute()
* element.querySelector()
* element.querySelectorAll()
* element.getElementsByTagName()
* element.matches()
* node.nodeName
* node.nodeType
* node.attributes
* node.childNodes
* node.parentNode
* node.firstChild
* node.lastChild
* node.nextSibling
* node.previousSibling
* node.textContent

## 注意事项

1. 不支持 XML 文档解析 
2. 所有的 DOM 属性均为只读
3. window.getComputedStyle() 仅能获取元素或伪元素在 CSS 中定义的原始值或继承属性，但没有进行计算输出（例如 em \> px）
4. document.styleSheets 在浏览器中无法跨域访问 CSSOM，browser-x 没有做此限制

## 为什么使用 browser-x

browser-x 适合做这些事情：

1. 爬虫程序
2. 分析元素的样式使用情况，例如和 CSS 相关的开发工具

如果需要更多的 DOM 特性，例如跑基于 DOM 的测试脚本、甚至载入 jQuery 等，那么 [jsdom](https://github.com/tmpvar/jsdom) 这个项目可能会更适合你（它唯一没有做好的是样式解析）。
