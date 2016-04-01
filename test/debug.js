var browser = require('../');
var fs = require('fs');

// var baseURI = __dirname + '/debug.html';
// var html = fs.readFileSync(baseURI, 'utf8');

browser.open(__dirname + '/debug.html', {
    loadCssFile: false,
    debug: true
}, function(errors, window) {
    if (errors) {
        //console.log(errors);
        return;
    }

    window.onerror = console.error;

    var document = window.document;


    console.log(document.styleSheets[1].cssRules)
    console.log(document.title);
    console.log('outerHTML', document.querySelector('a').outerHTML);
    console.log(document.querySelector('a').href);
    console.log(document.querySelector('a').style.color);
    //console.log(document.querySelectorAll('a[style]'))
    console.log(document.querySelectorAll('[checked]').length)
    console.log(document.querySelectorAll('#select2 option[selected]').length);
    console.log(document.querySelectorAll('#select2 option[class]').length)
});

// var window = browser.sync(html, {
//     baseURI: baseURI,
//     loadCssFile: false
// });