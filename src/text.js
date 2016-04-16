'use strict';

var CharacterData = require('./character-data');
var Node = require('./node');

function Text(ownerDocument, data) {
    CharacterData.call(this, ownerDocument, '#text', data, Node.TEXT_NODE);
}

Text.prototype = Object.create(CharacterData.prototype);
Text.prototype.constructor = Text;

module.exports = Text;