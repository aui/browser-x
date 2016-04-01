'use strict';

var path = require('path');
var url = require('url');
var crypto = require('crypto');


/**
 * FontFace 描述类
 * @param   {String}
 * @param   {String}
 * @param   {Array<FontFile>}
 * @param   {String}
 * @param   {String}
 */
function FontFace(id, family, files, stretch, style, weight) {
    this.id = id;
    this.family = family;
    this.files = files;
    this.stretch = stretch;
    this.style = style;
    this.weight = weight;
}


/**
 * 解析 @font-face
 * @param   {CSSFontFaceRule}
 * @return  {FontFace}
 */
FontFace.parse = function parseFontFace(cssFontFaceRule) {
    var baseURI = cssFontFaceRule.parentStyleSheet.href;
    var s = cssFontFaceRule.style;

    var family = s['font-family'];
    var stretch = s['font-stretch'];
    var style = s['font-style'];
    var weight = s['font-weight'];

    var src = s.src;
    var files = parseFontFaceSrc(src, baseURI);

    family = parseFontfamily(family)[0];

    var id = crypto
        .createHash('md5')
        .update(files.join(','))
        .digest('hex');

    return new FontFace(id, family, files, stretch, style, weight);
};



/**
 * 匹配字体
 * @see https://www.w3.org/html/ig/zh/wiki/CSS3字体模块#.E5.AD.97.E4.BD.93.E5.8C.B9.E9.85.8D.E7.AE.97.E6.B3.95
 * @param   {CSSStyleRule}
 * @return  {Boolean}
 */
FontFace.prototype.matche = function(cssStyleRule) {
    var style = cssStyleRule.style;
    var fontFamily = style['font-family'];

    if (!fontFamily) {
        return false;
    }

    var fontFamilys = parseFontfamily(fontFamily);

    // TODO 完善匹配算法
    if (fontFamilys.indexOf(this.family) !== -1) {
        return true;
    } else {
        return false;
    }
};



// 解析 @font-face src 值
function parseFontFaceSrc(value, baseURI) {
    var list = [];
    var src;

    var RE_FONT_URL = /url\(["']?(.*?)["']?\)(?:\s*format\(["']?(.*?)["']?\))?/ig;

    RE_FONT_URL.lastIndex = 0;

    while ((src = RE_FONT_URL.exec(value)) !== null) {
        list.push(new FontFile(baseURI, src[1], src[2]));
    }

    return list;
}



// font-face 路径与字体类型描述信息类
function FontFile(baseURI, source, format) {

    if (baseURI) {
        source = url.resolve(baseURI, source);
    }

    if (!format) {

        switch (path.dirname(source.replace(/[\?#].*$/, '')).toLowerCase()) {
            case '.eot':
                format = 'embedded-opentype';
                break;
            case '.woff':
                format = 'woff';
                break;
            case '.ttf':
                format = 'truetype';
                break;
            case '.svg':
                format = 'svg';
                break;
        }
    } else {
        format = format.toLowerCase();
    }

    this.source = source;
    this.format = format;
}

FontFile.prototype.toString = function() {
    return this.source;
};



// 解析 font-family 属性值为数组
function parseFontfamily(fontFamily) {
    // TODO test
    var list = fontFamily
        .replace(/^\s*["']?|["']?\s*$|["']?\s*(,)\s*["']?/g, '$1')
        .split(',');
    return list;
}



module.exports = FontFace;