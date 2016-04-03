function decode(string, tag) {

    var tag = tag || '\\';
    var newString = '';

    for (var i = 0, char, on, len = string.length; i < len; i++) {
        char = string.charAt(i);

        if (on) {
            if (char === tag) {
                newString += tag;
            } else {
                newString += String.fromCharCode(parseInt(string.substr(i, 4), 16));
                i += 3;
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


console.log(decode('\\7cd6\\997c'))