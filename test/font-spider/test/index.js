var fontSpider = require('../');

fontSpider(__dirname + '/index.html', {
    loadCssFile: true
}).then(function(data) {
    console.log(data)
}, function(errors) {
    console.error(errors.stack);
});