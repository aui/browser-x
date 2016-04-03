// var fontSpider = require('../');

// fontSpider('http://fontawesome.io/icons/', {
//     loadCssFile: true,
//     silent: false,
//     resourceTimeout: 5000
// }).then(function(data) {
//     console.log(JSON.stringify(data, null, 4))
// }, function(errors) {
//     console.error('error', errors.stack || errors, errors.message);
// }).catch(function(errors) {
//     console.error('stack', errors.stack);
// });


var FontSpider = require('../font-spider');

new FontSpider('http://fontawesome.io/icons/', {
    loadCssFile: true,
    silent: false,
    resourceTimeout: 5000,
    resourceBeforeLoad: console.info
}).then(function(data) {
    console.log(JSON.stringify(data, null, 4))
}, function(errors) {
    console.error(errors.stack);
}).catch(function(errors) {
    console.error(errors.stack);
});