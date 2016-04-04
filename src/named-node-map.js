'use strict';

function NamedNodeMap() {
    Object.defineProperties(this, {
        _index: {
            value: {}
        }
    });
}

NamedNodeMap.prototype = {

    constructor: NamedNodeMap,

    length: 0,

    getNamedItem: function(name) {
        return this[this._index[name]] || null;
    },

    setNamedItem: function(node) {
        var name = node.nodeName;
        var index = this._index[name];

        this[name] = node;

        if (typeof index === 'number') {
            var oldNode = this[index];
            this[index] = node;

            return oldNode;
        } else {
            this[this.length] = node;
            this._index[name] = this.length;
            this.length++;

            return null;
        }
    },

    removeNamedItem: function(name) {
        var index = this._index[name];

        delete this[name];;

        if (typeof index === 'number') {
            var node = Array.prototype.splice.call(this, index, 1)[0];
            var length = this.length;
            index = -1;

            // 重建索引
            while (++index < length) {
                this._index[this[index].nodeName] = index;
            }

            return node;
        } else {
            return null;
        }
    },

    item: function(index) {
        return this[index] || null;
    }
};


module.exports = NamedNodeMap;