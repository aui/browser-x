'use strict';

var CharacterData = require('./character-data');
var Node = require('./node');

function Comment(ownerDocument, data) {
    CharacterData.call(this, ownerDocument, '#comment', data, Node.COMMENT_NODE);
}

Comment.prototype = Object.create(CharacterData.prototype);
Comment.prototype.constructor = Comment;

module.exports = Comment;