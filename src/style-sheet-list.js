'use strict';

function StyleSheetList() {
    this._length = 0;
}

StyleSheetList.prototype = {
    constructor: StyleSheetList,
    item: function(i) {
        return this[i];
    },
    push: function(sheet) {
        this[this._length] = sheet;
        this._length++;
    },
    get length() {
        return this._length;
    }
};


module.exports = StyleSheetList;