var FontSpider = require('../font-spider');

new FontSpider('http://www.apple.com/cn', {
    loadCssFile: true,
    silent: true,
    resourceTimeout: 5000,
    resourceBeforeLoad: console.info
}).then(function(data) {
    console.log(JSON.stringify(data, null, 4))
}, function(errors) {
    console.error(errors.stack);
}).catch(function(errors) {
    console.error(errors.stack);
});