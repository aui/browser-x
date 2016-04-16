'use strict';

function StyleSheetList() {}

StyleSheetList.prototype = {
    constructor: StyleSheetList,
    length: 0,
    item: function(i) {
        return this[i];
    },
    push: function(sheet) {
        this[this.length] = sheet;
        this.length++;
    }
};


module.exports = StyleSheetList;