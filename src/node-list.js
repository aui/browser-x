'use strict';

function NodeList(nodes) {
    Array.prototype.push.apply(this, nodes);
}

NodeList.prototype = Object.create(Object.prototype, {});
NodeList.prototype.constructor = NodeList;


NodeList.prototype.item = function(index) {
    return this[index] || null;
};


module.exports = NodeList;