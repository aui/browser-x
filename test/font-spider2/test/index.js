var fontSpider = require('../');

fontSpider(__dirname + '/index.html', {
    loadCssFile: true,
    silent: false
}).then(function(data) {
    console.log(JSON.stringify(data, null, 4))
}, function(errors) {
    console.error(errors.stack);
}).catch(function(errors) {
    console.error(errors.stack);
});