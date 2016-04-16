'use strict';


/**
 * unicode 字符串解码
 * @see http://andyyou.github.io/javascript/2015/05/21/js-unicode-issue.html
 * @param   {String}
 * @param   {String}    编码开始标记，默认`\u`
 */
function decode(string, tag) {

    tag = tag || '\\u';

    var newString = '';
    var open = false;
    var char, charCode;
    var index = -1;
    var length = string.length;
    while (++index < length) {
        char = string.charAt(index);
        charCode = char.charCodeAt(0);
        if (open) {
            if (char === tag) {
                newString += tag;
            } else {
                var hex = parseInt(string.substr(index, 4), 16);
                if (isNaN(hex)) {
                    newString += char;
                } else {
                    newString += String.fromCharCode(hex);
                    index += 3;
                }
            }
            open = false;
        } else {
            if (char === tag) {
                open = true;
            } else {
                newString += char;
            }
        }
    }

    return newString;

}


module.exports = decode;