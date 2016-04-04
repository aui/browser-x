'use strict';


/**
 * UTF8 字符串解码
 * @param   {String}
 * @param   {String}    编码开始标记，默认`\`
 */
function decode(string, tag) {

    tag = tag || '\\';

    var newString = '';
    var len = string.length;
    var on;

    for (var i = 0, char; i < len; i++) {
        char = string.charAt(i);

        if (on) {
            if (char === tag) {
                newString += tag;
            } else {
                var hex = parseInt(string.substr(i, 4), 16);
                if (isNaN(hex)) {
                    newString += char;
                } else {
                    newString += String.fromCharCode(hex);
                    i += 3;
                }
            }
            on = false;
        } else {
            if (char === tag) {
                on = true;
            } else {
                newString += char;
            }
        }
    }

    return newString;
}

module.exports = decode;