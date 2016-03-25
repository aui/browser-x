'use strict';

function NamedNodeMap() {
    Object.defineProperties(this, {
        _nodes: {
            value: []
        }
    });
}

NamedNodeMap.prototype = Object.create(Object.prototype, {
    length: {
        get: function() {
            return this._nodes.length;
        }
    }
});

NamedNodeMap.prototype.constructor = NamedNodeMap;

// TODO 性能优化
NamedNodeMap.prototype.getNamedItem = function(name) {
    var node;
    var i = -1;
    var n = this._nodes.length;
    while (++i < n) {
        if ((node = this._nodes[i]).nodeName == name) {
            return node;
        }
    }
    return null;
};

NamedNodeMap.prototype.setNamedItem = function(node) {
    var name = node.nodeName;
    var oldNode;
    var i = -1;
    var n = this._nodes.length;
    while (++i < n) {
        if ((oldNode = this._nodes[i]).nodeName == name) {
            this._nodes[i] = node;
            return oldNode;
        }
    }
    this._nodes.push(node);
    return null;
};

NamedNodeMap.prototype.removeNamedItem = function(name) {
    var node;
    var i = -1;
    var n = this._nodes.length;
    while (++i < n) {
        if ((node = this._nodes[i]).nodeName == name) {
            this._nodes.splice(i, 1);
            return node;
        }
    }
    return null;
};

NamedNodeMap.prototype.item = function(index) {
    return this._nodes[index] || null;
};

module.exports = NamedNodeMap;