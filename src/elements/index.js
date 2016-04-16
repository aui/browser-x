'use strict';

var elements = {
    '*': require('./html-unknown-element'),
    'A': require('./html-anchor-element'),
    'IMG': require('./html-image-element'),
    'LINK': require('./html-link-element'),

    // support nwmatcher
    'BUTTON': require('./html-button-element'),
    'INPUT': require('./html-input-element'),
    'SELECT': require('./html-select-element'),
    'OPTION': require('./html-option-element'),
    'TEXTAREA': require('./html-text-area-element')
};


module.exports = {
    create: function(namespaceURI, tagName) {
        tagName = tagName.toUpperCase();
        if (elements.hasOwnProperty(tagName)) {
            return new elements[tagName](this, tagName, namespaceURI);
        } else {
            return new elements['*'](this, tagName, namespaceURI);
        }
    }
};