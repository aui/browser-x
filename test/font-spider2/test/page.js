var FontSpider = require('../font-spider');

new FontSpider('http://font-spider.org/', {
    loadCssFile: true,
    silent: false,
    resourceTimeout: 5000
}).then(function(data) {
    console.log(JSON.stringify(data, null, 4))
}, function(errors) {
    console.error(errors.stack);
}).catch(function(errors) {
    console.error(errors.stack);
});