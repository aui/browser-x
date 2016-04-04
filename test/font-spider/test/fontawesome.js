var fontSpider = require('../');

fontSpider('http://fontawesome.io/icons/', {
    loadCssFile: true,
    silent: false,
    resourceTimeout: 8000,
    resourceBeforeLoad: console.info
}).then(function(data) {
    console.log(JSON.stringify(data, null, 4))
}, function(errors) {
    console.error('error', errors.stack || errors, errors.message);
}).catch(function(errors) {
    console.error('stack', errors.stack);
});