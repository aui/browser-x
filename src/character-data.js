'use strict';

var Node = require('./node');

function CharacterData(ownerDocument, name, data, type) {
    Node.call(this, ownerDocument, name, data, type);
}

CharacterData.prototype = Object.create(Node.prototype, {
    length: {
        get: function() {
            return this.nodeValue.length;
        }
    },
    data: {
        get: function() {
            return this.nodeValue;
        }
    }
});

CharacterData.prototype.constructor = CharacterData;

module.exports = CharacterData;