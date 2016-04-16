'use strict';

var cascade = require('./cascade');
var inherit = require('./config/inherit.json');

// TODO 计算值
module.exports = function getComputedStyle(node, pseudo) {

    var cacheKey = '_computedStyle::' + pseudo;

    if (node[cacheKey]) {
        return node[cacheKey];
    }

    var currentStyle = cascade(node, pseudo);
    var parentNode = pseudo ? node : node.parentNode;
    var INHERIT = 'inherit';
    var DOCUMENT = '#document';

    inherit.forEach(function(key) {
        var currentValue = currentStyle[key];

        var parentStyle;
        var parentStyleValue;
        var styles = [];

        if (!currentValue || currentValue === INHERIT) {
            out: while (parentNode && parentNode.nodeName !== DOCUMENT) {

                parentStyle = cascade(parentNode);
                parentStyleValue = parentStyle[key];

                if (parentStyleValue && parentStyleValue !== INHERIT) {
                    styles.push(currentStyle);
                    setInheritValue(styles, key, parentStyleValue);
                    break out;
                }

                styles.push(parentStyle);
                parentNode = parentNode.parentNode;
            }
        }
    });


    function setInheritValue(styles, key, value) {
        styles.forEach(function(style) {
            style[key] = value;
        });
    }


    node[cacheKey] = currentStyle;

    return currentStyle;
};