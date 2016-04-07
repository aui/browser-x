var decode = require('../../src/utils/decode');
var assert = require('assert');

describe('Decode', function() {
    it("#1", function() {
        assert.equal(decode('\\7cd6', '\\'), '糖');
    });
    it("#2", function() {
        assert.equal(decode('\\\\7cd6', '\\'), '\\7cd6');
    });
    it("#3", function() {
        assert.equal(decode('\\7cd6\\997c', '\\'), '糖饼');
    });
    it("#4", function() {
        assert.equal(decode('\\u7cd6\\u997c', '\\'), 'u7cd6u997c');
    });
    it("#5", function() {
        assert.equal(decode('--\\7cd6--\\997c--', '\\'), '--糖--饼--');
    });
    it("#6", function() {
        assert.equal(decode('\\7cd6\\\\997c', '\\'), '糖\\997c');
    });
    it("#7", function() {
        assert.equal(decode('\\\\7cd6\\997c', '\\'), '\\7cd6饼');
    });
    it("#8", function() {
        assert.equal(decode('\\7cd6\\997cba', '\\'), '糖饼ba'); // TODO: chrome 把 饼ba 解析为乱码
    });
    it("#9", function() {
        assert.equal(decode('dd\\7cd6\\997cba', '\\'), 'dd糖饼ba'); // TODO: chrome 把 饼ba 解析为乱码
    });
    it("#10", function() {
        assert.equal(decode('💩\\d834\\df06\\d83d\\dca9', '\\'), '💩𝌆💩');
    });
});