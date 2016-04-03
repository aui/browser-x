var FontSpider = require('../font-spider');

new FontSpider('http://www.font-spider.org/', {
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