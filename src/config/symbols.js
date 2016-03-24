var symbols = {};
var createSymbol = typeof Symbol === 'function' ? Symbol : function(name) {
    return '__' + name;
}

var list = ['doctype', 'documentElement', 'nwmatcher', 'styleSheets',
    'parserAdapter', 'style', 'parent', 'first', 'last', 'next',
    'previous', 'attributes'
];


list.forEach(function(name) {
    symbols[name] = Symbol(name);
});

module.exports = symbols;