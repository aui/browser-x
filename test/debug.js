var dedom = require("../");
var fs = require('fs');
var html = fs.readFileSync(__dirname + '/hello.html', 'utf8');
var eachCssStyleRule = require('../src/style/each-css-style-rule');


var document = dedom(html, {
    baseURI: __dirname + '/hello.html',
    loadCssFile: true
}).then(function(window) {

    var document = window.document;

    console.log(document.body.innerHTML)
    console.log("document.getElementsByTagName('h1').length", document.getElementsByTagName('h1').length);
    console.log("document.querySelector('h1').nodeName", document.querySelector('h1').nodeName);
    console.log("document.getElementById('test') !== null", document.getElementById('test') !== null);
    console.log("document.getElementsByTagName('h1').item(0).innerHTML", document.getElementsByTagName('h1').item(0).innerHTML);
    console.log("document.getElementsByTagName('html').length", document.getElementsByTagName('html').length);
    console.log("document.getElementsByTagName('*').length", document.getElementsByTagName('*').length);
    console.log("document.querySelectorAll('*').length", document.querySelectorAll('*').length);
    console.log("document.querySelectorAll('h2 > b').length", document.querySelectorAll('h2 > b').length)
    console.log("document.querySelector('body').textContent", document.querySelector('body').textContent);
    //console.log("document.querySelector('body').innerHTML", document.querySelector('body').innerHTML);
    //console.log("documeng.querySelector('html').outerHTML", document.querySelector('html').outerHTML);
    console.log("document.title", document.title);
    console.log("document.body.matches('body')", document.body.matches('body'))
    console.log("document.querySelector('h1').style.marginLeft", document.querySelector('h1').style.marginLeft)
    console.log("document.querySelector('[style]').tagName", document.querySelector('[style]').tagName)

    var getComputedStyle = window.getComputedStyle;

    console.log("getComputedStyle(document.querySelector('h1')).padding", getComputedStyle(document.querySelector('h1')).padding);
    console.log("getComputedStyle(document.body).color", getComputedStyle(document.body).color);
    console.log("getComputedStyle(document.querySelector('h1')).fontFamily", getComputedStyle(document.querySelector('h1')).fontFamily);
    console.log("getComputedStyle(document.querySelector('h1'), '::after').content", getComputedStyle(document.querySelector('h1'), '::after').content);
    console.log("getComputedStyle(document.querySelector('h1'), '::after').fontFamily", getComputedStyle(document.querySelector('h1'), '::after').fontFamily);


    Array.prototype.forEach.call(document.getElementsByTagName('*'), function(node) {
        console.log(getComputedStyle(node).fontFamily)
    });

    eachCssStyleRule(document, function(rule) {
        console.log(rule.selectorText)
    });
}).catch(function(e) {
    console.log(e.stack);
});