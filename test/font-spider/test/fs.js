var fs = require('fs');

var txt = fs.readFileSync(__dirname + '/u.txt', 'utf8');


// 这里很容易出问题！！！！！！！！！！！！！！！！！！！！！！！！
// TODO browser bug: 获取到的是原始的 unicode，需要进行手动转码
function fixEncoding(string) {
    string = JSON.stringify(string).replace(/\\\\([^u].{3})/g, '\\u$1');
    string = JSON.parse('{"string": ' + string + '}').string;
    return string;
}

console.log(fixEncoding(txt))