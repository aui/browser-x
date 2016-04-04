var browser = require('../');
var fs = require('fs');

// var baseURI = __dirname + '/debug.html';
// var html = fs.readFileSync(baseURI, 'utf8');

browser.open(__dirname + '/debug.html', {
    loadCssFile: false,
    silent: false
}, function(errors, window) {
    if (errors) {
        //console.log(errors);
        return;
    }
    var document = window.document;
    var element= document.querySelectorAll("[style*='font']");
    console.log(element)
});
