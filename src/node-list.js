'use strict';

// TODO 下标索引与`length`只读
function NodeList(nodes) {
    Array.prototype.push.apply(this, nodes);
}

NodeList.prototype = Object.create(Object.prototype, {});
NodeList.prototype.constructor = NodeList;


NodeList.prototype.item = function(index) {
    return this[index] || null;
};


module.exports = NodeList;