var b = require('../../../');

b.open('http://fontawesome.io/icons/', {
    loadCssFile: true,
    silent: false,
    resourceTimeout: 5000
}).then(function(window) {
    var x = window.document.getElementById('ssssssss');
    console.log(x)
}, function(errors) {
    console.error(errors.stack);
}).catch(function(errors) {
    console.error(errors.stack);
});