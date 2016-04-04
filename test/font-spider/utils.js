'use strict';

module.exports = {
    // '.class, [data-name=",\""], .class2'
    // >>> ['.class', '[data-name=",\""]', '.class2']
    split: function(string, splitChar) {

        splitChar = splitChar || ',';

        var array = [];
        var len = string.length;
        var on = null;
        var escapeChar = '\\';
        var RE_BLANK = /[\s\n\r\t]/;
        var quotationChars = {
            '"': '"',
            "'": "'"
        };

        for (var i = 0, char; i < len; i++) {
            char = string.charAt(i);

            if (on) {
                if (char === on && string.charAt(i - 1) !== escapeChar) {
                    on = null;
                }
                array[array.length - 1] += char;
            } else {
                if (char === splitChar) {
                    array.push('');
                } else {
                    if (quotationChars[char]) {
                        on = quotationChars[char];
                    }

                    if (!array.length) {
                        array.push('');
                    }

                    if (!RE_BLANK.test(char)) {
                        array[array.length - 1] += char;
                    }
                }
            }
        }

        return array;
    }
};