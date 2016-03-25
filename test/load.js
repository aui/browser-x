var browser = require('../');

browser.load('http://www.baidu.com/', {}, function (errors, window) {

    if (errors) {
        throw errors;
    }

    var document = window.document;
    console.log(document.title);

});