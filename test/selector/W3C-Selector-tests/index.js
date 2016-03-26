'use strict';
var fs = require('fs');
var browser = require('../../../');
var Assert = require('assert');
var NW = require('nwmatcher/src/nwmatcher-noqsa');

describe('W3C-Selector-tests', function() {

    //     this.timeout(20000);

    //     it('tests', function() {
    var html = fs.readFileSync(__dirname + '/W3C-Selector-tests.html', 'utf8');

    var window = browser.sync(html, {
        baseURI: __dirname + '/W3C-Selector-tests.html',
        loadCssFile: true
    });
    var document = window.document;
    /******************************************/

    var $ = NW({
        document: document
    }).select;

    if (window.location.hash.indexOf("target") == -1)
        window.location.hash = "#target";

    var root = document.getElementById("root");
    var root2 = document.getElementById("root2");
    var root3 = document.getElementById("root3");
    var results = [];
    //var tests = 0,
    //    passed = 0;
    var cache = {};

    var cssElem = document.getElementById("test");
    var css = (cssElem.innerHTML || cssElem.textContent || cssElem.innerText).split("\n");
    for (var i = 0; i < css.length; i++) {
        css[i] = css[i].replace(/\/\*.*?\*\//g, "")
            .replace(/^\s*|\s*$/g, "").split(/\s*{/);
    }

    var ecssElem = document.getElementById("error");
    var ecss = (ecssElem.innerHTML || ecssElem.textContent || ecssElem.innerText).split("\n");
    for (var i = 0; i < ecss.length; i++) {
        ecss[i] = ecss[i].replace(/\/\*.*?\*\//g, "")
            .replace(/^\s*|\s*$/g, "").split(/\s*{/);
    }

    // interfaceCheck(root, "Element");
    // runTest(css, "Element", root, true);
    // check("Inside Element", root, true, false);
    // cacheCheck("Element", root);
    // check("Outside Element", root2, passed === 0 ? "autofail" : false, false);
    // runTest(ecss, "Syntax Error: Element", root, false);
    // jqTests("Element", root3, "querySelectorAll");

    // 已经删除了 cloneNode 方法
    // var root4 = root2.cloneNode(true);
    // interfaceCheck(root4, "Disconnected Element");
    // runTest(css, "Disconnected Element", root4, true);
    // check("Disconnected Element", root4, true, true);
    // cacheCheck("Disconnected Element", root4);
    // runTest(ecss, "Syntax Error: Disconnected Element", root4, false);
    // jqTests("Disconnected Element", root3.cloneNode(true), "querySelectorAll");

    // var fragment = document.createDocumentFragment();
    // fragment.appendChild(root2.cloneNode(true));

    // interfaceCheck(fragment, "Fragment");
    // runTest(css, "Fragment", fragment, true);
    // check("Fragment", fragment, true, true);
    // runTest(ecss, "Syntax Error: Fragment", fragment, false);
    // cacheCheck("Fragment", fragment);

    root.parentNode.removeChild(root);

    interfaceCheck(document, "Document");
    runTest(css, "Document", document, true);
    check("Document", document, true, false);
    runTest(ecss, "Syntax Error: Document", document, false);
    jqTests("Document", document, "querySelectorAll");
    cacheCheck("Document", document);

    //done();

    function interfaceCheck(obj, type) {
        var q = typeof obj.querySelector === "function" || typeof obj.querySelector === 'object';
        assert(q, type + " supports querySelector");
        var qa = typeof obj.querySelectorAll === "function" || typeof obj.querySelectorAll === 'object';
        assert(qa, type + " supports querySelectorAll");
        return q && qa;
    }

    // function done() {
    //     var r = document.getElementById("results");
    //     var li = document.createElement("li");
    //     var b = document.createElement("b");
    //     b.appendChild(document.createTextNode(((passed / tests) * 100).toFixed(1) + "%"));
    //     li.appendChild(b);
    //     li.appendChild(document.createTextNode(": " + passed + " passed, " + (tests - passed) + " failed"));
    //     r.appendChild(li);

    //     for (var i = 0; i < results.length; i++) {
    //         var li = document.createElement("li");
    //         li.className = (results[i][0] === "FAIL" ? "fail" : "pass");
    //         var span = document.createElement("span");
    //         span.style.color = (results[i][0] === "FAIL" ? "red" : "green");
    //         span.appendChild(document.createTextNode(results[i][0]));
    //         li.appendChild(span);
    //         li.appendChild(document.createTextNode(" " + results[i][1]));
    //         r.appendChild(li);
    //     }
    // }

    // function done() {
    //     console.log(((passed / tests) * 100).toFixed(1) + "%", ": " + passed + " passed, " + (tests - passed) + " failed")

    //     for (var i = 0; i < results.length; i++) {
    //         if (results[i][0] === 'FAIL') {
    //             console.error(results[i][0], " ", results[i][1]);
    //         }
    //     }
    // }


    function cacheCheck(type, root) {
        try {
            var pre = $("div", root),
                preLength = pre.length;

            var div = document.createElement("div");
            (root.body || root).appendChild(div);

            var post = $("div", root),
                postLength = post.length;

            assert(pre.length == preLength, type + ": StaticNodeList");
            assert(post.length != pre.length, type + ": StaticNodeList");
        } catch (e) {
            assert(false, type + ": StaticNodeList");
            assert(false, type + ": StaticNodeList");
        }

        if (div)
            (root.body || root).removeChild(div);
    }


    function runTest(css, type, root, expect) {
        var pass = false;
        try {
            $("", root);
        } catch (e) {
            pass = /syntax|error/i.test(e.name);
        }
        assert(pass, type + ".querySelectorAll Empty String");

        pass = false;
        try {
            pass = $(null, root).length === 0;
        } catch (e) {
            pass = false;
        }
        assert(pass, type + ".querySelectorAll null");

        pass = false;
        try {
            pass = $(undefined, root).length === 0;
        } catch (e) {
            pass = false;
        }
        assert(pass, type + ".querySelectorAll undefined");

        pass = false;
        try {
            if ($)
            pass = $();
        } catch (e) {
            pass = true;
        }
        assert(pass, type + ".querySelectorAll no value");

        var pass = false;
        try {
            $("", root)[0];
        } catch (e) {
            pass = /syntax|error/i.test(e.name);
        }
        assert(pass, type + ".querySelector Empty String");

        pass = false;
        try {
            pass = !$(null, root)[0];
        } catch (e) {
            pass = false;
        }
        assert(pass, type + ".querySelector null");

        pass = false;
        try {
            pass = !$(undefined, root)[0];
        } catch (e) {
            pass = false;
        }
        assert(pass, type + ".querySelector undefined");

        pass = false;
        try {
            if ($)
                $()[0];
        } catch (e) {
            pass = true;
        }
        assert(pass, type + ".querySelector no value");

        for (var i = 0; i < css.length; i++) {
            var test = css[i];
            if (test.length == 2) {
                var query = test[0],
                    color = test[1].match(/: ([^\s;]+)/)[1];

                try {
                    var found = $(query, root);

                    for (var f = 0; f < found.length; f++) {
                        found[f].style.backgroundColor = color;
                    }

                    var pass = color != "red" || found.length === 0;

                    assert(expect && pass, type + ".querySelectorAll: " + query);
                } catch (e) {
                    var pass = !expect && /syntax|error/i.test(e.name);
                    assert(pass, type + ".querySelectorAll: " + query);
                }

                if (expect) {
                    var pass = false;

                    try {
                        var found2 = $("  \t\r\n  " + query + "  \t\r\n  ", root);
                        pass = found2.length == found.length;
                    } catch (e) {}

                    assert(pass, type + ".querySelectorAll Whitespace Trim: " + query);
                }

                try {
                    var single = $(query, root)[0];

                    var pass = found.length == 0 && single === null ||
                        found.length && found[0] == single;

                    assert(expect, type + ".querySelector: " + query);
                } catch (e) {
                    var pass = !expect && /syntax|error/i.test(e.name);
                    assert(pass, type + ".querySelector: " + query);
                }
            }
        }

    }


    function check(type, root, expect, fragment) {
        traverse(root, function(div) {
            if ((div.getAttribute("class") || "").toString().indexOf("unitTest") > -1 &&
                (!fragment || div.getAttribute("id") !== "nofragment")) {
                var bg;

                if (document.defaultView) {
                    var view = document.defaultView.getComputedStyle(div, null);
                    bg = view.getPropertyValue("background-color") || div.style.backgroundColor;
                } else if (div.currentStyle) {
                    bg = div.currentStyle.backgroundColor || div.style.backgroundColor;
                }

                var pass = bg && bg.indexOf("(255, 0, 0") == -1 && bg.indexOf("#ff0000") == -1 && bg.indexOf("red") == -1;
                assert(pass === expect, type + ": " + (div.title || div.parentNode.title));
            }
        });
    }

    function traverse(elem, fn) {
        if (elem.nodeType === 1) {
            fn(elem);

            elem = elem.firstChild;
            while (elem) {
                traverse(elem, fn);
                elem = elem.nextSibling;
            }
        }
    }

    function assert(pass, title) {
        //results.push([(!pass ? "FAIL" : "PASS"), title]);


        it(title, function() {
            Assert(pass, true);
        });

        //tests++;
        //passed += (pass ? 1 : 0);
    }

    function jqTests(type, root, select) {

        function query(q) {
            return $(q, root);
        }

        function t(name, q, ids, restrict, expectError) {
            var pass = true;

            if (restrict === false && root != document)
                return;

            var prepend = "#root3 ";
            q = (restrict === false || restrict === ":root" ? "" : prepend) + q.replace(/,/g, ", " + prepend);
            var nq = q.replace(/>/g, "&gt;").replace(/</g, "&lt;");

            var pass = false;

            try {
                var results = query(q);
                pass = hasPassed(results, ids);
            } catch (e) {
                pass = expectError && /syntax|error/i.test(e.name);
            }

            assert(pass, type + ": " + name + " (" + nq + ")" +
                (pass ? "" : " Expected: " + extra(ids) + " Received: " + extra(results)));

            function hasPassed(results, ids) {
                var pass = (results && results.length == ids.length) || (!results && !ids);

                if (ids && results) {
                    for (var i = 0; ids && i < ids.length; i++) {
                        if (ids[i] !== results[i].getAttribute("id")) {
                            pass = false;
                        }
                    }
                } else {
                    pass = false;
                }

                return pass;
            }

            function extra(results) {
                var extra = " [";
                if (results) {
                    for (var i = 0; i < results.length; i++) {
                        extra += (extra.length > 2 ? "," : "") + "'" + (results[i].id || results[i]) + "'";
                    }
                }

                extra += "]";
                return extra;
            }
        }

        var all = query("*");
        assert(all && all.length > 30, type + ": Select all");
        var good = all && all.length;
        for (var i = 0; all && i < all.length; i++)
            if (all[i].nodeType != 1)
                good = false;
        assert(good, type + ": Select all elements, no comment nodes");

        if (root == document) {
            t(":root Selector", ":root", ["html"], false);
        } else {
            t(":root Selector", ":root", [], ":root");

            if (!root.parentNode) {
                t(":root All Selector", ":root *", [], ":root");
            }
        }

        if (root.parentNode || root == document) {
            var rootQuery = $(":root *", root);
            assert(rootQuery && rootQuery.length == $("*", root).length - (root == document ? 1 : 0), type + ": :root All Selector");
        }

        t("Element Selector", "p", ["firstp", "ap", "sndp", "en", "sap", "first"]);
        t("Element Selector", "body", ["body"], false);
        t("Element Selector", "html", ["html"], false);
        t("Parent Element", "div p", ["firstp", "ap", "sndp", "en", "sap", "first"]);
        var param = query("#object1 param");
        assert(param && param.length == 2, type + ": Object/param as context");

        var l = query("#length");
        assert(l && l.length, type + ': &lt;input name="length"&gt; cannot be found under IE');
        var lin = query("#lengthtest input");
        assert(lin && lin.length, type + ': &lt;input name="length"&gt; cannot be found under IE');

        t("Broken Selector", "[", undefined, undefined, true);
        t("Broken Selector", "(", undefined, undefined, true);
        t("Broken Selector", "{", undefined, undefined, true);
        t("Broken Selector", "<", undefined, undefined, true);
        t("Broken Selector", "()", undefined, undefined, true);
        t("Broken Selector", "<>", undefined, undefined, true);
        t("Broken Selector", "{}", undefined, undefined, true);

        t("ID Selector", "#body", ["body"], false);
        t("ID Selector w/ Element", "body#body", ["body"], false);
        t("ID Selector w/ Element", "ul#first", []);
        t("ID selector with existing ID descendant", "#firstp #simon1", ["simon1"]);
        t("ID selector with non-existant descendant", "#firstp #foobar", []);

        t("ID selector using UTF8", "#台北Táiběi", ["台北Táiběi"]);
        t("Multiple ID selectors using UTF8", "#台北Táiběi, #台北", ["台北Táiběi", "台北"]);
        t("Descendant ID selector using UTF8", "div #台北", ["台北"]);
        t("Child ID selector using UTF8", "form > #台北", ["台北"]);

        t("Escaped ID", "#foo\\:bar", ["foo:bar"]);
        t("Escaped ID", "#test\\.foo\\[5\\]bar", ["test.foo[5]bar"]);
        t("Descendant escaped ID", "div #foo\\:bar", ["foo:bar"]);
        t("Descendant escaped ID", "div #test\\.foo\\[5\\]bar", ["test.foo[5]bar"]);
        t("Child escaped ID", "form > #foo\\:bar", ["foo:bar"]);
        t("Child escaped ID", "form > #test\\.foo\\[5\\]bar", ["test.foo[5]bar"]);

        t("ID Selector, child ID present", "#form > #radio1", ["radio1"]); // bug #267
        t("ID Selector, not an ancestor ID", "#form #first", []);
        t("ID Selector, not a child ID", "#form > #option1a", []);

        t("All Children of ID", "#foo > *", ["sndp", "en", "sap"]);
        t("All Children of ID with no children", "#firstUL > *", []);

        t("ID selector with non-existant ancestor", "#asdfasdf #foobar", []); // bug #986

        //t( "body div#form", [], "ID selector within the context of another element" );

        t("Class Selector", ".blog", ["mark", "simon"]);
        t("Class Selector", ".blog.link", ["simon"]);
        t("Class Selector w/ Element", "a.blog", ["mark", "simon"]);
        t("Parent Class Selector", "p .blog", ["mark", "simon"]);

        t("Class selector using UTF8", ".台北Táiběi", ["utf8class1"]);
        t("Class selector using UTF8", ".台北", ["utf8class1", "utf8class2"]);
        t("Class selector using UTF8", ".台北Táiběi.台北", ["utf8class1"]);
        t("Class selector using UTF8", ".台北Táiběi, .台北", ["utf8class1", "utf8class2"]);
        t("Descendant class selector using UTF8", "div .台北Táiběi", ["utf8class1"]);
        t("Child class selector using UTF8", "form > .台北Táiběi", ["utf8class1"]);

        t("Escaped Class", ".foo\\:bar", ["foo:bar"]);
        t("Escaped Class", ".test\\.foo\\[5\\]bar", ["test.foo[5]bar"]);
        t("Descendant escaped Class", "div .foo\\:bar", ["foo:bar"]);
        t("Descendant escaped Class", "div .test\\.foo\\[5\\]bar", ["test.foo[5]bar"]);
        t("Child escaped Class", "form > .foo\\:bar", ["foo:bar"]);
        t("Child escaped Class", "form > .test\\.foo\\[5\\]bar", ["test.foo[5]bar"]);

        t("Comma Support", "a.blog, p", ['firstp', 'ap', 'mark', 'sndp', 'en', 'sap', 'simon', 'first']);
        t("Comma Support", "a.blog , p", ['firstp', 'ap', 'mark', 'sndp', 'en', 'sap', 'simon', 'first']);
        t("Comma Support", "a.blog ,p", ['firstp', 'ap', 'mark', 'sndp', 'en', 'sap', 'simon', 'first']);
        t("Comma Support", "a.blog,p", ['firstp', 'ap', 'mark', 'sndp', 'en', 'sap', 'simon', 'first']);

        t("Child", "p > a", ["simon1", "google", "groups", "mark", "yahoo", "simon"]);
        t("Child", "p> a", ["simon1", "google", "groups", "mark", "yahoo", "simon"]);
        t("Child", "p >a", ["simon1", "google", "groups", "mark", "yahoo", "simon"]);
        t("Child", "p>a", ["simon1", "google", "groups", "mark", "yahoo", "simon"]);
        t("Child w/ Class", "p > a.blog", ["mark", "simon"]);
        t("All Children", "code > *", ["anchor1", "anchor2"]);
        t("All Grandchildren", "p > * > *", ["anchor1", "anchor2"]);
        t("Adjacent", "a + a", ["groups"]);
        t("Adjacent", "a +a", ["groups"]);
        t("Adjacent", "a+ a", ["groups"]);
        t("Adjacent", "a+a", ["groups"]);
        t("Adjacent", "p + p", ["ap", "en", "sap"]);
        t("Comma, Child, and Adjacent", "a + a, code > a", ["groups", "anchor1", "anchor2"]);

        t("First Child", "p:first-child", ["firstp", "sndp"]);
        t("Nth Child", "p:nth-child(1)", ["firstp", "sndp"]);

        t("Last Child", "p:last-child", ["sap"]);
        t("Last Child", "a:last-child", ["simon1", "anchor1", "mark", "yahoo", "anchor2", "simon"]);

        t("Nth-child", "#main form#form > *:nth-child(2)", ["text2"]);
        t("Nth-child", "#main form#form > :nth-child(2)", ["text2"]);

        t("Nth-child", "#form #select1 option:nth-child(3)", ["option1c"]);
        t("Nth-child", "#form #select1 option:nth-child(0n+3)", ["option1c"]);
        t("Nth-child", "#form #select1 option:nth-child(1n+0)", ["option1a", "option1b", "option1c", "option1d"]);
        t("Nth-child", "#form #select1 option:nth-child(1n)", ["option1a", "option1b", "option1c", "option1d"]);
        t("Nth-child", "#form #select1 option:nth-child(n)", ["option1a", "option1b", "option1c", "option1d"]);
        t("Nth-child", "#form #select1 option:nth-child(even)", ["option1b", "option1d"]);
        t("Nth-child", "#form #select1 option:nth-child(odd)", ["option1a", "option1c"]);
        t("Nth-child", "#form #select1 option:nth-child(2n)", ["option1b", "option1d"]);
        t("Nth-child", "#form #select1 option:nth-child(2n+1)", ["option1a", "option1c"]);
        t("Nth-child", "#form #select1 option:nth-child(3n)", ["option1c"]);
        t("Nth-child", "#form #select1 option:nth-child(3n+1)", ["option1a", "option1d"]);
        t("Nth-child", "#form #select1 option:nth-child(3n+2)", ["option1b"]);
        t("Nth-child", "#form #select1 option:nth-child(3n+3)", ["option1c"]);
        t("Nth-child", "#form #select1 option:nth-child(3n-1)", ["option1b"]);
        t("Nth-child", "#form #select1 option:nth-child(3n-2)", ["option1a", "option1d"]);
        t("Nth-child", "#form #select1 option:nth-child(3n-3)", ["option1c"]);
        t("Nth-child", "#form #select1 option:nth-child(3n+0)", ["option1c"]);
        t("Nth-child", "#form #select1 option:nth-child(-n+3)", ["option1a", "option1b", "option1c"]);

        t("Attribute Exists", "a[title]", ["google"]);
        t("Attribute Exists", "*[title]", ["google"]);
        t("Attribute Exists", "[title]", ["google"]);

        t("Attribute Equals", "a[rel='bookmark']", ["simon1"]);
        t("Attribute Equals", 'a[rel="bookmark"]', ["simon1"]);
        t("Attribute Equals", "a[rel=bookmark]", ["simon1"]);
        t("Multiple Attribute Equals", "#form input[type='hidden'],#form input[type='radio']", ['radio1', 'radio2', 'hidden1']);
        t("Multiple Attribute Equals", "#form input[type=\"hidden\"],#form input[type='radio']", ['radio1', 'radio2', 'hidden1']);
        t("Multiple Attribute Equals", "#form input[type=hidden],#form input[type=radio]", ['radio1', 'radio2', 'hidden1']);

        t("Attribute selector using UTF8", "span[lang=中文]", ["台北"]);

        t("Attribute Begins With", "a[href ^= 'http://www']", ["google", "yahoo"]);
        t("Attribute Ends With", "a[href $= 'org/']", ["mark"]);
        t("Attribute Contains", "a[href *= 'google']", ["google", "groups"]);

        // t("Select options via [selected]", "#select1 option[selected]", ["option1a"] );
        t("Select options via [selected]", "#select1 option[selected]", []);
        t("Select options via [selected]", "#select2 option[selected]", ["option2d"]);
        t("Select options via [selected]", "#select3 option[selected]", ["option3b", "option3c"]);

        t("Grouped Form Elements", "input[name='foo[bar]']", ["hidden2"]);

        t(":not() Existing attribute", "#form select:not([multiple])", ["select1", "select2"]);
        t(":not() Equals attribute", "#form select:not([name=select1])", ["select2", "select3"]);
        t(":not() Equals quoted attribute", "#form select:not([name='select1'])", ["select2", "select3"]);

        t("First Child", "p:first-child", ["firstp", "sndp"]);
        t("Last Child", "p:last-child", ["sap"]);
        t("Only Child", "a:only-child", ["simon1", "anchor1", "yahoo", "anchor2"]);
        t("Empty", "ul:empty", ["firstUL"]);
        //t( "Enabled UI Element", "#form input:enabled", ["text1","radio1","radio2","check1","check2","hidden2","name"] );
        t("Disabled UI Element", "#form input:disabled", ["text2"]);
        t("Checked UI Element", "#form input:checked", ["radio2", "check1"]);
        t("Element Preceded By", "p ~ div", ["foo", "fx-queue", "fx-tests", "moretests"]);
        t("Not", "a.blog:not(.link)", ["mark"]);

        t("Attribute string containing a closing bracket", '[data-test="foo]bar"]', ["escapedSelectorClosingBracket"]);
        t("Attribute string containing a double quote", '[data-test="foo\\"bar"]', ["escapedSelectorDoubleQuote"]);
        t("Attribute string containing a single quote", "[data-test='foo\\'bar']", ["escapedSelectorSingleQuote"]);
        t("Attribute string containing a backslash", "[data-test='foo\\\\bar']", ["escapedSelectorBackslash"]);
        t("Attribute string containing a line feed", "[data-test='foo\\a bar']", ["escapedSelectorLF"]);
        t("Attribute string containing a carriage return ", "[data-test='foo\\00000d bar']", ["escapedSelectorCR"]);
        t("Attribute string containing a supplementary code point", "[data-test='foo\\24B62 bar']", ["escapedSupplementary"]);
        t("Attribute string containing a backslash and quotes", "[data-test='foo\\\\\\\"\\'\\62 ar']", ["escapedCombined"]);

        t("Attribute identifier containing a closing bracket", '[data-test=foo\\]bar]', ["escapedSelectorClosingBracket"]);
        t("Attribute identifier containing a double quote", '[data-test=foo\\"bar]', ["escapedSelectorDoubleQuote"]);
        t("Attribute identifier containing a single quote", "[data-test=foo\\'bar]", ["escapedSelectorSingleQuote"]);
        t("Attribute identifier containing a backslash", "[data-test=foo\\\\bar]", ["escapedSelectorBackslash"]);
        t("Attribute identifier containing a line feed", "[data-test=foo\\a bar]", ["escapedSelectorLF"]);
        t("Attribute identifier containing a carriage return ", "[data-test=foo\\00000d bar]", ["escapedSelectorCR"]);
        t("Attribute identifier containing a supplementary code point", "[data-test=foo\\24B62 bar]", ["escapedSupplementary"]);
        t("Attribute identifier containing a backslash and quotes", "[data-test=foo\\\\\\\"\\'\\62 ar]", ["escapedCombined"]);
    }

    /******************************************/

});