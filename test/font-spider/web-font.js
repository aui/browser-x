'use strict';

var FontFace = require('./font-face');

/**
 * WebFont 描述类 - 继承自 FontFace
 * @param   {object}
 */
function WebFont(options) {
    FontFace.call(this, options);
    this.chars = '';
    this.selectors = [];
}

WebFont.parse = function(cssFontFaceRule) {
    return new WebFont(FontFace.parse(cssFontFaceRule));
};
WebFont.prototype = Object.create(FontFace.prototype);
WebFont.prototype.constructor = WebFont;


module.exports = WebFont;