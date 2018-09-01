/* 
 * Copyright (c), Pierre-Anthony Lemieux <pal@palemieux.com>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * * Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

var model = require("./document-type");
var infoset = require('./infoset');
var names = require('./names');
var utils = require('./utils');
var condition = require('./condition-parser');
var url = require('url');


/**
 * 
 * parameter attributes
 * 
 */

var ttp = {
    attributes: new utils.NamespaceCollection(names.NS_TTP),
    elements: new utils.NamespaceCollection(names.NS_TTP)
};

ttp.attributes.add(
    new model.Attribute(
        names.NS_TTP,
        "displayAspectRatio",
        function (attr, errorHandler) {
            var m = attr.value.match(/^(\d+)\s+(\d+)$/);

            if ((!m) || (!m[1]) || parseInt(m[1]) === 0 || (!m[2]) || parseInt(m[2]) === 0) {
                errorHandler.error("Syntax error");
            }

        }
    )
);

ttp.attributes.add(
    new model.Attribute(
        names.NS_TTP,
        "processorProfileCombination",
        function (attr, errorHandler) {
            if (["leastRestrictive", "mostRestrictive", "replace", "ignore"].indexOf(attr.value) === -1) {
                errorHandler.error("Syntax error");
            }
        }
    )
);

function _isValidDesignators(str) {

    if (!str) return false;

    var d = str.match(/\S+/g);

    if (!d) return false;

    var urls = {};

    for (var i = 0; i < d.length; i++) {

        if (! _isValidURI(d[i], names.NS_PROFILE)) {
            return false;
        }

        var s = (new url.URL(d[i], names.NS_PROFILE)).toString();

        if (s in urls) {

            return false;

        }

        urls[s] = "";

    }

    return true;
}

ttp.attributes.add(
    new model.Attribute(
        names.NS_TTP,
        "processorProfiles",
        function (attr, errorHandler) {

            if (!attr.value) {
                errorHandler.error("Syntax error");
                return;
            }

            var s_all = attr.value.match(/^all\(([^\)]*)\)$/);

            if (s_all) {

                if (!_isValidDesignators(s_all[1])) {
                    errorHandler.error("Syntax error");
                }

                return;
            }

            var s_any = attr.value.match(/^any\(([^\)]*)\)$/);

            if (s_any) {

                if (!_isValidDesignators(s_any[1])) {
                    errorHandler.error("Syntax error");
                }

                return;
            }

            if (!_isValidDesignators(attr.value)) {
                errorHandler.error("Syntax error");
                return;
            }

        }
    )
);

ttp.attributes.add(
    new model.Attribute(
        names.NS_TTP,
        "contentProfileCombination",
        function (attr, errorHandler) {
            if (["leastRestrictive", "mostRestrictive", "replace", "ignore"].indexOf(attr.value) === -1) {
                errorHandler.error("Syntax error");
            }
        }
    )
);

ttp.attributes.add(
    new model.Attribute(
        names.NS_TTP,
        "inferProcessorProfileMethod",
        function (attr, errorHandler) {
            if (["loose", "strict"].indexOf(attr.value) === -1) {
                errorHandler.error("Syntax error");
            }
        }
    )
);

ttp.attributes.add(
    new model.Attribute(
        names.NS_TTP,
        "inferProcessorProfileSource",
        function (attr, errorHandler) {
            if (["combined", "first"].indexOf(attr.value) === -1) {
                errorHandler.error("Syntax error");
            }
        }
    )
);

function _isValidBinary(str) {
    return ["1", "0", "true", "false"].indexOf(str) !== -1;
}

ttp.attributes.add(
    new model.Attribute(
        names.NS_TTP,
        "permitFeatureNarrowing",
        function (attr, errorHandler) {
            if (!_isValidBinary(attr.value)) {
                errorHandler.error("Syntax error");
            }
        }
    )
);

ttp.attributes.add(
    new model.Attribute(
        names.NS_TTP,
        "permitFeatureWidening",
        function (attr, errorHandler) {
            if (!_isValidBinary(attr.value)) {
                errorHandler.error("Syntax error");
            }
        }
    )
);


ttp.attributes.add(
    new model.Attribute(
        names.NS_TTP,
        "validation",
        function (attr, errorHandler) {
            if (["required", "optional", "prohibited"].indexOf(attr.value) === -1) {
                errorHandler.error("Syntax error");
            }
        }
    )
);

ttp.attributes.add(
    new model.Attribute(
        names.NS_TTP,
        "validationAction",
        function (attr, errorHandler) {
            if (["abort", "warn", "ignore"].indexOf(attr.value) === -1) {
                errorHandler.error("Syntax error");
            }
        }
    )
);


/**
 * 
 * styling attributes
 * 
 */

var tts = {
    attributes: new utils.NamespaceCollection(names.NS_TTS)
};


var HEX_COLOR_RE = /^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})?$/;
var DEC_COLOR_RE = /^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/;
var DEC_COLORA_RE = /^rgba\(\s*(\d+),\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/;
var NAMED_COLOR = {
    transparent: [0, 0, 0, 0],
    black: [0, 0, 0, 255],
    silver: [192, 192, 192, 255],
    gray: [128, 128, 128, 255],
    white: [255, 255, 255, 255],
    maroon: [128, 0, 0, 255],
    red: [255, 0, 0, 255],
    purple: [128, 0, 128, 255],
    fuchsia: [255, 0, 255, 255],
    magenta: [255, 0, 255, 255],
    green: [0, 128, 0, 255],
    lime: [0, 255, 0, 255],
    olive: [128, 128, 0, 255],
    yellow: [255, 255, 0, 255],
    navy: [0, 0, 128, 255],
    blue: [0, 0, 255, 255],
    teal: [0, 128, 128, 255],
    aqua: [0, 255, 255, 255],
    cyan: [0, 255, 255, 255]
};

var ANIMATION_VALUE_LIST_VALUE_RE = /\s*((?:\\.)|[^;])+\s*/g;

function _handleAnimationValueList(attr, errorHandler, validationFunction) {

    if (!attr.value) {

        errorHandler.error("Syntax error");

        return;

    }

    var values = attr.value.match(ANIMATION_VALUE_LIST_VALUE_RE);

    if (values === null) {

        errorHandler.error("Syntax error");

    } else {

        if (values.length > 1 && attr.parent.name !== tt.elements.byName.animate.name) {

            errorHandler.error("Invalid use of <animation-value-list>");

        } else {

            values.forEach(
                function (value) {
                    validationFunction(value.replace("\\\\", ""));
                }
            );

        }

    }
}

var NUMBER_RE = /((?:\+|\-)?\d*(?:\.\d+)?)/;

var PERCENT_RE = /^((?:\+|\-)?\d*(?:\.\d+)?)%$/;

function Dimension(value, unit) {
    this.value = value;
    this.unit = unit;
}

function parsePercentage(str) {

    if (!str) return null;

    var r = str.match(PERCENT_RE);

    if (!r) return null;

    return new Dimension(parseFloat(r[1]), "%");
}

var SCALAR_RE = /^((?:\+|\-)?\d*(?:\.\d+)?)(px|em|c|rh|rw)$/;

function parseLength(str) {

    if (!str) {
        return null;
    }

    var r = parsePercentage(str);

    if (r) return r;

    var m = str.match(SCALAR_RE);

    if (!(m && m[1] && m[2])) return null;

    return new Dimension(parseFloat(m[1]), m[2]);
}

function _isValidLength(value) {

    if (parsePercentage(value)) {

        return true;

    } else {

        return SCALAR_RE.test(value);

    }

    return true;

}

function parseMeasure(value) {

    if (["auto", "available", "fitContent", "maxContent", "minContent"].indexOf(value) !== -1) {

        return value;

    } else {

        return parseLength(value);

    }

}

function _isValidMeasure(value) {

    if (["auto", "available", "fitContent", "maxContent", "minContent"].indexOf(value) !== -1) {

        return true;

    } else {

        return parseLength(value) !== null;

    }

    return true;

}

function parseExtent(value) {

    if (["auto", "contain", "cover"].indexOf(value) !== -1) {

        return value;

    } else {

        var measures = value.split(/\s+/);

        if (measures.length != 2) {
            return null;
        }

        var l0 = parseMeasure(measures[0]);

        if (!l0) {
            return null;
        }

        var l1 = parseMeasure(measures[1]);

        if (!l1) {
            return null;
        }

        return [l0, l1];

    }

    return null;

}

function _isValidKeyword(str) {
    return str === "center" ||
        str === "left" ||
        str === "top" ||
        str === "bottom" ||
        str === "right";

}

function _isValidPosition(value) {

    var s = value.split(/\s+/);

    if (s.length > 4 || s.length === 0) {

        return false;

    }

    for (var i = 0; i < s.length; i++) {

        if (_isValidKeyword(s[i])) {

            if (i < s.length && parseLength(s[i + 1]) !== null) {

                i++;

            }

        } else if (parseLength(s[i])) {

            if (s.length > 2) {

                /* lengths must be preceded by keyworkds for 3 or 4 component */

                return false;

            }

        } else {

            return false;

        }

    }

    return true;
}

function _isValidBorderRadii(str) {

    var radii = str.match(/^radii\(([^,]+)(?:,([^,]+))?\)$/);

    if (radii === null) {

        return false;

    }

    if (radii[1]) {

        var l1 = parseLength(radii[1].trim());

        if (l1 === null || l1.value < 0) return false;

    } else {

        return false;

    }

    if (radii[2]) {

        var l2 = parseLength(radii[2].trim());

        if (l2 === null || l2.value < 0) return false;

    }

    return true;

}

function _isBorderThickness(str) {

    if (["thin", "medium", "thick"].indexOf(str) !== -1) return true;

    var l = parseLength(str);

    if (l && l.value > 0) return true;

    return false;

}

var QUOTED_STRING_RE = /^("([^"\\]|\\\S)*")|('([^'\\]|\\\S)*')$/;

function _isValidTextEmphasis(str) {

    var c = str.match(/\S+(\([^\)]*\))|\S+/g);

    if (!c) {
        return false;
    }

    var isStyle = false;
    var isFilled = false;
    var isColor = false;
    var isPosition = false;
    var isShape = false;

    for (var i = 0; i < c.length; i++) {

       if (["before", "after", "outside"].indexOf(c[i]) !== -1 && (!isPosition)) {
            isPosition = true;
        } else if ((_isValidColor(c[i]) || c[i] === "current") && (!isColor)) {
            isColor = true;
        } else if (["none", "auto"].indexOf(c[i]) !== -1 && (!isStyle)) {
            isStyle = true;
        } else if (QUOTED_STRING_RE.test(c[i]) && (!isStyle)) {
            isStyle = true;
        } else if (["filled", "open"].indexOf(c[i]) !== -1 && (!isFilled)) {
            isStyle = true;
            isFilled = true;
        } else if (["circle", "dot", "sesame"].indexOf(c[i]) !== -1 && (!isShape)) {
            isStyle = true;
            isShape = true;
        }else {
            return false;
        }

    }

    return isPosition || isColor || isStyle;

}

function _isValidBorder(str) {

    var c = str.match(/\S+(\([^\)]*\))|\S+/g);

    if (!c) {
        return false;
    }

    var isBorderThickness = false;
    var isBorderStyle = false;
    var isBorderColor = false;
    var isBorderRadii = false;

    for (var i = 0; i < c.length; i++) {

        if (_isBorderThickness(c[i]) && (!isBorderThickness)) {
            isBorderThickness = true;
        } else if (["none", "dotted", "dashed", "solid", "double"].indexOf(c[i]) !== -1 && (!isBorderStyle)) {
            isBorderStyle = true;
        } else if (_isValidColor(c[i]) && (!isBorderColor)) {
            isBorderColor = true;
        } else if (_isValidBorderRadii(c[i]) && (!isBorderRadii)) {
            isBorderRadii = true;
        } else {
            return false;
        }

    }

    return isBorderThickness || isBorderStyle || isBorderColor || isBorderRadii;

}

function parseColor(str) {

    if (str === null) {
        return null;
    }

    var m;
    var r = null;

    if (str in NAMED_COLOR) {

        r = NAMED_COLOR[str];

    } else if ((m = HEX_COLOR_RE.exec(str)) !== null) {

        r = [parseInt(m[1], 16),
        parseInt(m[2], 16),
        parseInt(m[3], 16),
        (m[4] !== undefined ? parseInt(m[4], 16) : 255)];

    } else if ((m = DEC_COLOR_RE.exec(str)) !== null) {

        r = [parseInt(m[1]),
        parseInt(m[2]),
        parseInt(m[3]),
            255];

    } else if ((m = DEC_COLORA_RE.exec(str)) !== null) {

        r = [parseInt(m[1]),
        parseInt(m[2]),
        parseInt(m[3]),
        parseInt(m[4])];

    }

    if (r === null ||
        r[0] > 255 || r[0] < 0 ||
        r[1] > 255 || r[1] < 0 ||
        r[2] > 255 || r[2] < 0 ||
        r[3] > 255 || r[3] < 0
    ) {

        return null;

    }

    return r;

}

function _isValidColor(str) {
    return parseColor(str) !== null;
}



tts.attributes.add(
    new model.Attribute(
        names.NS_TTS,
        "backgroundClip",
        function (attr, errorHandler) {
            _handleAnimationValueList(
                attr,
                errorHandler,
                function (value) {
                    if (["border", "content", "paced", "padding"].indexOf(value) === -1) {
                        errorHandler.error("Syntax error");
                    }
                }
            );
        }
    )
);

tts.attributes.add(
    new model.Attribute(
        names.NS_TTS,
        "backgroundColor",
        function (attr, errorHandler) {
            _handleAnimationValueList(
                attr,
                errorHandler,
                function (value) {
                    if (!_isValidColor(value)) {
                        errorHandler.error("Syntax error");
                    }
                }
            );
        }
    )
);

tts.attributes.add(
    new model.Attribute(
        names.NS_TTS,
        "backgroundExtent",
        function (attr, errorHandler) {
            _handleAnimationValueList(
                attr,
                errorHandler,
                function (value) {
                    var e = parseExtent(value);

                    if (!e) {
                        errorHandler.error("Syntax error");
                    }
                }
            );
        }
    )
);

var URI_FRAGMENT_RE = /^\#([\!\$\&\'\(\)\*\+\,\;\=\-\.\_\~\:\@\w]|(\%[a-fA-F0-9]{2}))*$/;

function recordIDs(element, IDs) {

    for (var i = 0; i < element.children.length; i++) {

        if (element.children[i] instanceof infoset.ElementItem) {

            if (element.children[i].name === tt.elements.byName.image.name &&
                xml.attributes.byName.id.name in element.children[i].attributes) {
                IDs.push(element.children[i].attributes[xml.attributes.byName.id.name]);
            }

            recordIDs(element.children[i], IDs);

        }

    }

}

function _isFragment(str) {
    return URI_FRAGMENT_RE.test(str);
}

function _isFragmentValid(attr) {

    var root = attr.parent;

    while (root.parent) {
        root = root.parent;
    }

    /* find all image elements with an id */

    var IDs = [];

    recordIDs(root, IDs);

    return IDs.indexOf(decodeURI(attr.value.substring(1))) !== -1;

}

tts.attributes.add(
    new model.Attribute(
        names.NS_TTS,
        "backgroundImage",
        function (attr, errorHandler) {
            _handleAnimationValueList(
                attr,
                errorHandler,
                function (value) {
                    if (value === "none") {

                        return;

                    } else if (_isFragment(value)) {

                        if (!_isFragmentValid(attr)) {
                            errorHandler.error("Bad fragment identifier");
                        }

                    } else if (!_isValidURI(value)) {

                        errorHandler.error("Syntax error");

                    }
                }
            );
        }
    )
);

tts.attributes.add(
    new model.Attribute(
        names.NS_TTS,
        "backgroundOrigin",
        function (attr, errorHandler) {
            _handleAnimationValueList(
                attr,
                errorHandler,
                function (value) {
                    if (["border", "content", "padding"].indexOf(value) === -1) {
                        errorHandler.error("Syntax error");
                    }
                }
            );
        }
    )
);

tts.attributes.add(
    new model.Attribute(
        names.NS_TTS,
        "backgroundRepeat",
        function (attr, errorHandler) {
            _handleAnimationValueList(
                attr,
                errorHandler,
                function (value) {
                    if (["repeat", "repeatX", "repeatY", "noRepeat"].indexOf(value) === -1) {
                        errorHandler.error("Syntax error");
                    }
                }
            );
        }
    )
);

tts.attributes.add(
    new model.Attribute(
        names.NS_TTS,
        "backgroundPosition",
        function (attr, errorHandler) {
            _handleAnimationValueList(
                attr,
                errorHandler,
                function (value) {
                    if (!_isValidPosition(value)) {
                        errorHandler.error("Syntax error");
                    }
                }
            );
        }
    )
);

tts.attributes.add(
    new model.Attribute(
        names.NS_TTS,
        "border",
        function (attr, errorHandler) {
            _handleAnimationValueList(
                attr,
                errorHandler,
                function (value) {
                    if (!_isValidBorder(value)) {
                        errorHandler.error("Syntax error");
                    }
                }
            );
        }
    )
);

tts.attributes.add(
    new model.Attribute(
        names.NS_TTS,
        "bpd",
        function (attr, errorHandler) {
            _handleAnimationValueList(
                attr,
                errorHandler,
                function (value) {
                    var m = parseMeasure(value);

                    if (m === null) {
                        errorHandler.error("Syntax error");
                    } else if (m instanceof Dimension && m.value < 0) {
                        errorHandler.error("Negative length error");
                    }
                }
            );
        }
    )
);

tts.attributes.add(
    new model.Attribute(
        names.NS_TTS,
        "color",
        function (attr, errorHandler) {
            _handleAnimationValueList(
                attr,
                errorHandler,
                function (value) {
                    if (!_isValidColor(value)) {
                        errorHandler.error("Syntax error");
                    }
                }
            );
        }
    )
);

tts.attributes.add(
    new model.Attribute(
        names.NS_TTS,
        "direction",
        function (attr, errorHandler) {
            _handleAnimationValueList(
                attr,
                errorHandler,
                function (value) {
                    if (["ltr", "rtl"].indexOf(value) === -1) {
                        errorHandler.error("Syntax error");
                    }
                }
            );
        }
    )
);

tts.attributes.add(
    new model.Attribute(
        names.NS_TTS,
        "display",
        function (attr, errorHandler) {
            _handleAnimationValueList(
                attr,
                errorHandler,
                function (value) {
                    if (value === "inlineBlock") {
                        if ([tt.elements.byName.body.name,
                        tt.elements.byName.div.name,
                        tt.elements.byName.image.name,
                        tt.elements.byName.p.name,
                        tt.elements.byName.region.name].indexOf(attr.parent.name) !== -1) {
                            errorHandler.error("cannot be specified on element");
                        }
                    } else if (["auto", "none"].indexOf(value) === -1) {
                        errorHandler.error("Syntax error");
                    }
                }
            );
        }
    )
);

tts.attributes.add(
    new model.Attribute(
        names.NS_TTS,
        "displayAlign",
        function (attr, errorHandler) {
            _handleAnimationValueList(
                attr,
                errorHandler,
                function (value) {
                    if (["before", "center", "after", "justify"].indexOf(value) === -1) {
                        errorHandler.error("Syntax error");
                    }
                }
            );
        }
    )
);

tts.attributes.add(
    new model.Attribute(
        names.NS_TTS,
        "extent",
        function (attr, errorHandler) {
            _handleAnimationValueList(
                attr,
                errorHandler,
                function (value) {
                    var e = parseExtent(value);

                    if (!e) {
                        errorHandler.error("invalid syntax");
                    }

                    if (Array.isArray(e) && (e[0].value < 0 || e[1].value < 0)) {
                        errorHandler.error("invalid negative value");
                        return;
                    }

                    if (attr.parent.name === tt.elements.byName.tt.name) {

                        if (Array.isArray(e)) {

                            if (e[0].unit !== "px" || e[1].unit !== "px") {

                                errorHandler.error("invalid syntax");

                                return;

                            }

                        } else if (["contain", "auto"].indexOf(value) === -1) {

                            errorHandler.error("invalid keyword");

                            return;
                        }

                    }
                }
            );
        }
    )
);

tts.attributes.add(
    new model.Attribute(
        names.NS_TTS,
        "fontKerning",
        function (attr, errorHandler) {
            _handleAnimationValueList(
                attr,
                errorHandler,
                function (value) {
                    if (["none", "normal"].indexOf(value) === -1) {
                        errorHandler.error("invalid syntax");
                    }
                }
            );
        }
    )
);

tts.attributes.add(
    new model.Attribute(
        names.NS_TTS,
        "fontSelectionStrategy",
        function (attr, errorHandler) {
            _handleAnimationValueList(
                attr,
                errorHandler,
                function (value) {
                    if (["auto", "character"].indexOf(value) === -1) {
                        errorHandler.error("invalid syntax");
                    }
                }
            );
        }
    )
);

tts.attributes.add(
    new model.Attribute(
        names.NS_TTS,
        "fontShear",
        function (attr, errorHandler) {
            _handleAnimationValueList(
                attr,
                errorHandler,
                function (value) {
                    if (!parsePercentage(value)) {
                        errorHandler.error("invalid syntax");
                    }
                }
            );
        }
    )
);

tts.attributes.add(
    new model.Attribute(
        names.NS_TTS,
        "fontVariant",
        function (attr, errorHandler) {
            _handleAnimationValueList(
                attr,
                errorHandler,
                function (value) {
                    if (value === "normal") {
                        return;
                    }

                    var vars = [false, false, false];

                    var s = value.split(/\s+/);

                    for (var i = 0; i < s.length; i++) {

                        if (["super", "sub"].indexOf(s[i]) !== -1 && (!vars[0])) {
                            vars[0] = true;
                        } else if (["full", "half"].indexOf(s[i]) !== -1 && (!vars[1])) {
                            vars[1] = true;
                        } else if (s[i] === "ruby" && (!vars[2])) {
                            vars[2] = true;
                        } else {

                            errorHandler.error("Syntax error");

                        }

                    }

                    return vars[0] || vars[1] || vars[2];
                }
            );
        }
    )
);

tts.attributes.add(
    new model.Attribute(
        names.NS_TTS,
        "ipd",
        function (attr, errorHandler) {
            _handleAnimationValueList(
                attr,
                errorHandler,
                function (value) {
                    var m = parseMeasure(value);

                    if (m === null) {
                        errorHandler.error("Syntax error");
                    } else if (m instanceof Dimension && m.value < 0) {
                        errorHandler.error("Negative length error");
                    }
                }
            );
        }
    )
);

tts.attributes.add(
    new model.Attribute(
        names.NS_TTS,
        "letterSpacing",
        function (attr, errorHandler) {
            _handleAnimationValueList(
                attr,
                errorHandler,
                function (value) {
                    if (!(value === "normal" || parseLength(value))) {
                        errorHandler.error("Syntax error");
                    }
                }
            );
        }
    )
);

tts.attributes.add(
    new model.Attribute(
        names.NS_TTS,
        "lineShear",
        function (attr, errorHandler) {
            _handleAnimationValueList(
                attr,
                errorHandler,
                function (value) {
                    if (!parsePercentage(value)) {
                        errorHandler.error("invalid syntax");
                    }
                }
            );
        }
    )
);

function parseXMLFloat(str) {

    var FLOAT_RE = /[+-]?(\d+|(\d*\.\d*))([Ee][+-]?\d+)?/;

    var r = null;

    if (str === "NaN") {

        r = NaN;

    } else if (str === "-INF") {

        r = -Infinity;

    } else if (str === "INF") {

        r = Infinity;

    } else if (FLOAT_RE.test(str)) {

        r = parseFloat(str);

    }

    return r;
}

tts.attributes.add(
    new model.Attribute(
        names.NS_TTS,
        "opacity",
        function (attr, errorHandler) {
            _handleAnimationValueList(
                attr,
                errorHandler,
                function (value) {
                    if (parseXMLFloat(value) === null) {
                        errorHandler.error("invalid syntax");
                    }
                }
            );
        }
    )
);

tts.attributes.add(
    new model.Attribute(
        names.NS_TTS,
        "padding",
        function (attr, errorHandler) {
            _handleAnimationValueList(
                attr,
                errorHandler,
                function (value) {

                    if (!value) {

                        errorHandler.error("Syntax error");

                        return;

                    }

                    var m = value.split(/\s+/);

                    if (m.length === 0 || m.length > 4) {

                        errorHandler.error("Syntax error");

                        return;

                    }

                    for (var i = 0; i < m.length; i++) {

                        var l = parseLength(m[i]);

                        if ((!l) || l.value < 0) {

                            errorHandler.error("Syntax error");

                            return;

                        }

                    }

                }
            );
        }
    )
);

tts.attributes.add(
    new model.Attribute(
        names.NS_TTS,
        "position",
        function (attr, errorHandler) {
            _handleAnimationValueList(
                attr,
                errorHandler,
                function (value) {
                    if (!_isValidPosition(value)) {
                        errorHandler.error("invalid syntax");
                    }
                }
            );
        }
    )
);


tts.attributes.add(
    new model.Attribute(
        names.NS_TTS,
        "shear",
        function (attr, errorHandler) {
            _handleAnimationValueList(
                attr,
                errorHandler,
                function (value) {
                    if (!parsePercentage(value)) {
                        errorHandler.error("invalid syntax");
                    }
                }
            );
        }
    )
);

tts.attributes.add(
    new model.Attribute(
        names.NS_TTS,
        "textAlign",
        function (attr, errorHandler) {
            _handleAnimationValueList(
                attr,
                errorHandler,
                function (value) {
                    if (["left", "right", "center", "start", "end", "justify"].indexOf(value) === -1) {
                        errorHandler.error("Syntax error");
                    }
                }
            );
        }
    )
);

tts.attributes.add(
    new model.Attribute(
        names.NS_TTS,
        "textEmphasis",
        function (attr, errorHandler) {
            _handleAnimationValueList(
                attr,
                errorHandler,
                function (value) {
                    if (! _isValidTextEmphasis(value)) {
                        errorHandler.error("Syntax error");
                    }
                }
            );
        }
    )
);

tts.attributes.add(
    new model.Attribute(
        names.NS_TTS,
        "textOrientation",
        function (attr, errorHandler) {
            _handleAnimationValueList(
                attr,
                errorHandler,
                function (value) {
                    if (["mixed", "sideways", "sidewaysLeft", "sidewaysRight", "upright"].indexOf(value) === -1) {
                        errorHandler.error("Syntax error");
                    }
                }
            );
        }
    )
);

tts.attributes.add(
    new model.Attribute(
        names.NS_TTS,
        "unicodeBidi",
        function (attr, errorHandler) {
            _handleAnimationValueList(
                attr,
                errorHandler,
                function (value) {
                    if (["normal", "embed", "bidiOverride", "isolate"].indexOf(value) === -1) {
                        errorHandler.error("Syntax error");
                    }
                }
            );
        }
    )
);

tts.attributes.add(
    new model.Attribute(
        names.NS_TTS,
        "visibility",
        function (attr, errorHandler) {
            _handleAnimationValueList(
                attr,
                errorHandler,
                function (value) {
                    if (["visible", "hidden"].indexOf(attr.value) === -1) {
                        errorHandler.error("Syntax error");
                    }
                }
            );
        }
    )
);

/**
 * 
 * xlink attributes
 * 
 */


var xlink = {
    attributes: new utils.NamespaceCollection(names.NS_XLINK)
};

function _isValidURIList(str) {
    var uris = str.split(/\s+/);

    if (!uris) {
        return false;
    }

    for (var i = 0; i < uris.length; i++) {

        if (!_isValidURI(uris[i])) {
            return false;
        }

    }

    return true;

}

xlink.attributes.add(
    new model.Attribute(
        names.NS_XLINK,
        "arcrole",
        function (attr, errorHandler) {
            if (!_isValidURIList(attr.value)) {
                errorHandler.error("Syntax error");
            }
        }
    )
);

xlink.attributes.add(
    new model.Attribute(
        names.NS_XLINK,
        "href",
        function (attr, errorHandler) {
            if (!_isValidURI(attr.value)) {
                errorHandler.error("Syntax error");
            }

            var p = attr.parent.parent;

            while (p) {

                if (p.name === tt.elements.byName.span.name &&
                    xlink.attributes.byName.href.name in p.attributes) {

                    errorHandler.error("Nested href error");
                    break;

                }

                p = p.parent;

            }



        }
    )
);

xlink.attributes.add(
    new model.Attribute(
        names.NS_XLINK,
        "role",
        function (attr, errorHandler) {
            if (!_isValidURIList(attr.value)) {
                errorHandler.error("Syntax error");
            }
        }
    )
);

xlink.attributes.add(
    new model.Attribute(
        names.NS_XLINK,
        "show",
        function (attr, errorHandler) {
            if (["new", "replace", "embed", "other", "none"].indexOf(attr.value) === -1) {
                errorHandler.error("Syntax error");
            }
        }
    )
);

xlink.attributes.add(
    new model.Attribute(
        names.NS_XLINK,
        "title",
        function (attr, errorHandler) {
            /* can be any string */
        }
    )
);


/**
 * 
 * Unqualified attributes
 * 
 */


var unqual = {
    attributes: new utils.NamespaceCollection("")
};


var COORDINATE_RE = /^(\d*\.)?\d+$/;

function _isValidKeySplines(value) {

    var controls = value.split(/\s*;\s*/);

    for (var i = 0; i < controls.length; i++) {

        var coordinates = controls[i].split(/\s+/);

        for (var j = 0; j < coordinates.length; j++) {

            if (!coordinates[j].match(/^(\d*\.)?\d+$/)) {
                return false;
            }

        }

    }

    return true;
}


var TIME_RE = /(\d*\.)?\d+/;

var KEY_TIMES_RE = new RegExp("^" + TIME_RE.source + "(\s*;\s*" + TIME_RE.source + ")*$");

var REPEAT_COUNT_RE = /^(indefinite|((\d*\.)?\d+))$/;

var NON_NEGATIVE_INTEGER_RE = /(\+|\-)?\d+/;

var NC_NAME_RE = /^[A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][-.0-9A-Z_a-z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D    \u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]*%/;

var CLOCK_TIME_RE = /^(\d{2,}:\d{2}:\d{2}((\d+\.)|(:\d{2,}(\.\d+)?))?)$/;

var DATE_RE = /\d{4}\-\d{2}\-\d{2}/;

var WALL_TIME_RE = /(\d{2}:\d{2})|(\d{2}:\d{2}:\d{2}(\.\d+)?)/;

var OFFSET_TIME_RE = /^(\d+(?:\.\d+)?)(h|m|s|ms|f|t)$/;

var WALLCLOCK_TIME_RE = /^wallclock\(\s*([^\s)]+)\s*\)$/;

function _isValidTimeExpression(str) {

    return OFFSET_TIME_RE.test(str) || CLOCK_TIME_RE.test(str) || _isValidWallClockTime(str);
}

function _isValidWallClockTime(str) {

    if (str === null) return false;



    var m = WALLCLOCK_TIME_RE.exec(str);

    if (m === null) return false;

    var c = m[1].split("T");

    if (c.length === 2) {

        return DATE_RE.test(c[0]) && WALL_TIME_RE.test(c[1]);

    } else if (c.length === 1) {

        return DATE_RE.test(c[0]) || WALL_TIME_RE.test(c[0]);

    } else {

        return false;

    }

}

unqual.attributes.add(
    new model.Attribute(
        "",
        "condition",
        function (attr, errorHandler) {
            try {
                condition.parser.parse(attr.value);
            } catch (e) {
                errorHandler.error("Syntax error");
            }
        }
    )
);

unqual.attributes.add(
    new model.Attribute(
        "",
        "combine",
        function (attr, errorHandler) {
            if (["leastRestrictive", "mostRestrictive", "replace"].indexOf(attr.value) === -1) {
                errorHandler.error("Syntax error");
            }
        }
    )
);

unqual.attributes.add(
    new model.Attribute(
        "",
        "designator",
        function (attr, errorHandler) {
            if ((! ABSOLUTE_URI_RE.test(attr.value)) || _isFragment(attr.value)) {
                errorHandler.error("Syntax error");
            }
        }
    )
);

unqual.attributes.add(
    new model.Attribute(
        "",
        "calcMode",
        function (attr, errorHandler) {
            if (["discrete", "linear", "paced", "spline"].indexOf(attr.value) === -1) {
                errorHandler.error("Syntax error");
            }
        }
    )
);

unqual.attributes.add(
    new model.Attribute(
        "",
        "fill",
        function (attr, errorHandler) {
            if (["freeze", "remove"].indexOf(attr.value) === -1) {
                errorHandler.error("Syntax error");
            }
        }
    )
);

unqual.attributes.add(
    new model.Attribute(
        "",
        "keySplines",
        function (attr, errorHandler) {
            if (!_isValidKeySplines(attr.value)) {
                errorHandler.error("Syntax error");
            }
        }
    )
);

unqual.attributes.add(
    new model.Attribute(
        "",
        "keyTimes",
        function (attr, errorHandler) {
            if (!KEY_TIMES_RE.test(attr.value)) {
                errorHandler.error("Syntax error");
            }
        }
    )
);

unqual.attributes.add(
    new model.Attribute(
        "",
        "repeatCount",
        function (attr, errorHandler) {
            if (!REPEAT_COUNT_RE.test(attr.value)) {
                errorHandler.error("Syntax error");
            }
        }
    )
);

unqual.attributes.add(
    new model.Attribute(
        "",
        "encoding",
        function (attr, errorHandler) {
            if (["base16", "base32", "base32hex", "base64", "base64url"].indexOf(attr.value) === -1) {
                errorHandler.error("Syntax error");
            }
        }
    )
);

unqual.attributes.add(
    new model.Attribute(
        "",
        "length",
        function (attr, errorHandler) {
            if (!NON_NEGATIVE_INTEGER_RE.test(attr.value)) {
                errorHandler.error("Syntax error");
            }
        }
    )
);

unqual.attributes.add(
    new model.Attribute(
        "",
        "format",
        function (attr, errorHandler) {
            if (!(NC_NAME_RE.test(attr.value) || _isValidURI(attr.value))) {
                errorHandler.error("Syntax error");
            }
        }
    )
);

unqual.attributes.add(
    new model.Attribute(
        "",
        "src",
        function (attr, errorHandler) {

            if (_isFragment(attr.value)) {

                if (!_isFragmentValid(attr)) {

                    errorHandler.error("Bad fragment identifier");

                }

            } else if (!_isValidURI(attr.value)) {

                errorHandler.error("Syntax error");

            }
        }
    )
);

unqual.attributes.add(
    new model.Attribute(
        "",
        "type",
        function (attr, errorHandler) {
            /* defined as string */
            /* TODO: validate as RFC 6838 media type? */
            if (attr.parent.name === ttp.elements.byName.profile.name) {

                if (["processor", "content"].indexOf(attr.value) === -1) {
                    errorHandler.error("Syntax error");
                }

            }

        }
    )
);

unqual.attributes.add(
    new model.Attribute(
        "",
        "begin",
        function (attr, errorHandler) {
            if (!_isValidTimeExpression(attr.value)) {
                errorHandler.error("Syntax error");
            }
        }
    )
);

unqual.attributes.add(
    new model.Attribute(
        "",
        "end",
        function (attr, errorHandler) {
            if (!_isValidTimeExpression(attr.value)) {
                errorHandler.error("Syntax error");
            }
        }
    )
);

unqual.attributes.add(
    new model.Attribute(
        "",
        "dur",
        function (attr, errorHandler) {
            if (!_isValidTimeExpression(attr.value)) {
                errorHandler.error("Syntax error");
            }

            /* TODO: test for smpte time base and discontinuous marker mode */
        }
    )
);

unqual.attributes.add(
    new model.Attribute(
        "",
        "extends",
        function (attr, errorHandler) {
            if (!_isValidURI(attr.value)) {
                errorHandler.error("Syntax error");
            }
        }
    )
);

unqual.attributes.add(
    new model.Attribute(
        "",
        "restricts",
        function (attr, errorHandler) {
            if (!_isValidURI(attr.value)) {
                errorHandler.error("Syntax error");
            }
        }
    )
);

unqual.attributes.add(
    new model.Attribute(
        "",
        "range",
        function (attr, errorHandler) {
            if (!attr.value) {
                errorHandler.error("Syntax error");
                return;
            }

            var ranges = attr.value.split(/\s*,\s*/);

            if (ranges.length === 0) {
                errorHandler.error("Syntax error");
                return;
            }

            for (var i = 0; i < ranges.length; i++) {

                var codepoints = ranges[i].split("-");

                if (codepoints.length > 2) {
                    errorHandler.error("Syntax error");
                    return;
                }

                for (var j = 0; j < codepoints.length; j++) {

                    if (! /^(U|u)\+[0-9a-fA-F\?]{1,6}$/.test(codepoints[j])) {
                        errorHandler.error("Syntax error");
                        return;
                    }

                }
            }
        }
    )
);

unqual.attributes.add(
    new model.Attribute(
        "",
        "style",
        function (attr, errorHandler) {
            if (["normal", "italic", "oblique"].indexOf(attr.value) === -1) {
                errorHandler.error("Syntax error");
            }
        }
    )
);

unqual.attributes.add(
    new model.Attribute(
        "",
        "font",
        function (attr, errorHandler) {
            if (!_isValidURI(attr.value)) {
                errorHandler.error("Syntax error");
            }
        }
    )
);

unqual.attributes.add(
    new model.Attribute(
        "",
        "weight",
        function (attr, errorHandler) {
            if (["normal", "bold"].indexOf(attr.value) === -1) {
                errorHandler.error("Syntax error");
            }
        }
    )
);

/**
 * 
 * xml attributes
 * 
 */

var xml = {
    attributes: new utils.NamespaceCollection(names.NS_XML)
};

/* TODO: improve URI validation */

var URI_RE = /^([\w\:\/\?\#\[\]\@\_\.\-\~\$\&\'\(\)\*\+\,\;\=])+$/;

var ABSOLUTE_URI_RE = /^[a-zA-Z][a-zA-Z0-9+-.]*:[\w\:\/\?\#\[\]\@\_\.\-\~\$\&\'\(\)\*\+\,\;\=]*$/;
var REL_AUTHORITY_URI_RE = /^\/\/[\w\:\/\?\#\[\]\@\_\.\-\~\$\&\'\(\)\*\+\,\;\=]*$/;
var REL_ABSOLUTE_URI_RE = /^\/[\w\:\/\?\#\[\]\@\_\.\-\~\$\&\'\(\)\*\+\,\;\=]*$/;
var REL_NOSCHEME_URI_RE = /^([\w\-.~@!$'()*+,;=]|(%[a-fA-F\d]{2}))+(\/[\w\:\/\?\#\[\]\@\_\.\-\~\$\&\'\(\)\*\+\,\;\=]*)*$/;

function _isValidURI(value) {

    
    if (ABSOLUTE_URI_RE.test(value)) {

        return true;

    } else if (REL_AUTHORITY_URI_RE.test(value)) {

        return true;

    } else if (REL_ABSOLUTE_URI_RE.test(value)) {

        return true;

    } else if (REL_NOSCHEME_URI_RE.test(value)) {

        return true;

    } else if (value.length === 0) {

        return true;

    }

    return false;

}

xml.attributes.add(
    new model.Attribute(
        names.NS_XML,
        "base",
        function (attr, errorHandler) {
            if (!_isValidURI(attr.value)) {
                errorHandler.error("Syntax error");
            }
        }
    )
);

xml.attributes.add(
    new model.Attribute(
        names.NS_XML,
        "id",
        function (attr, errorHandler) {

            /* TODO */

        }
    )
);


/**
 * 
 * TTP elements
 * 
 */


/**
 * profile
 */

ttp.elements.add(
    new model.Element(
        names.NS_TTP,
        "profile",
        [
            unqual.attributes.byName.combine,
            unqual.attributes.byName.type,
            unqual.attributes.byName.designator,
            xml.attributes.byName.base,
            xml.attributes.byName.id
        ]
    )
);

/**
 * features
 */

ttp.elements.add(
    new model.Element(
        names.NS_TTP,
        "features",
        [
            xml.attributes.byName.base,
            unqual.attributes.byName.restricts,
            unqual.attributes.byName.extends
        ]
    )
);

/**
 * extensions
 */

ttp.elements.add(
    new model.Element(
        names.NS_TTP,
        "extensions",
        [
            xml.attributes.byName.base,
            unqual.attributes.byName.restricts,
            unqual.attributes.byName.extends
        ]
    )
);

/**
 * 
 * TT elements
 * 
 */

var tt = {
    elements: new utils.NamespaceCollection(names.NS_TT)
};

/**
 * tt
 */

tt.elements.add(
    new model.Element(
        names.NS_TT,
        "tt",
        [
            ttp.attributes.all,
            tts.attributes.byName.extent
        ]
    )
);



/**
 * head
 */

tt.elements.add(
    new model.Element(
        names.NS_TT,
        "head",
        xml.attributes.byName.base
    )
);



/**
 * layout
 */
tt.elements.add(
    new model.Element(names.NS_TT, "layout")
);

/**
 * region
 */

tt.elements.add(
    new model.Element(
        names.NS_TT,
        "region",
        [
            unqual.attributes.byName.begin,
            unqual.attributes.byName.end,
            unqual.attributes.byName.dur,
            tts.attributes.all
        ],
        function (element, errorHandler) {
            var p = element.parent;

            if (!p) {
                errorHandler.error("Invalid parent");
                return;
            }

            if (p.name === tt.elements.byName.layout.name) {

                if (!(xml.attributes.byName.id.name in element.attributes)) {

                    errorHandler.error("xml:id missing");
                    return;

                }

            } else {

                if (unqual.attributes.byName.begin.name in element.attributes ||
                    unqual.attributes.byName.end.name in element.attributes ||
                    unqual.attributes.byName.dur.name in element.attributes) {

                    errorHandler.error("illegal use of timing attributes");
                    return;

                }

            }
        }
    )
);

/**
 * styling
 */

tt.elements.add(
    new model.Element(
        names.NS_TT,
        "styling",
        [
            xml.attributes.byName.base/*,
        xml.attributes.id,
        xml.attributes.lang,
        xml.attributes.space*/
        ]
    )
);

/**
 * style
 */

tt.elements.add(
    new model.Element(
        names.NS_TT,
        "style",
        [
            unqual.attributes.byName.condition,
            tts.attributes.all
        ]
    )
);

/**
 * resources
 */

tt.elements.add(
    new model.Element(
        names.NS_TT,
        "resources",
        xml.attributes.byName.base
    )
);

/**
 * chunk
 */

tt.elements.add(
    new model.Element(
        names.NS_TT,
        "chunk",
        [
            unqual.attributes.byName.length,
            unqual.attributes.byName.encoding
        ]
    )
);

/**
 * source
 */

tt.elements.add(
    new model.Element(
        names.NS_TT,
        "source",
        [
            /*unqual.condition,*/
            unqual.attributes.byName.format,
            unqual.attributes.byName.src,
            unqual.attributes.byName.type/*,
            xml.attributes.byName.id,
            xml.attributes.byName.lang,
            xml.attributes.byName.space*/
        ]
    )
);

/**
 * image
 */

tt.elements.add(
    new model.Element(
        names.NS_TT,
        "image",
        [
            /*unqual.animate,*/
            unqual.attributes.byName.begin,
            unqual.attributes.byName.end,
            unqual.attributes.byName.dur,
            /*unqual.attributes.byName.region*/
            unqual.attributes.byName.src,
            /* unqual.attributes.byName.style */
            /* unqual.attributes.byName.timeContainer */
            unqual.attributes.byName.type,
            xlink.attributes.byName.arcrole,
            xlink.attributes.byName.href,
            xlink.attributes.byName.role,
            xlink.attributes.byName.show,
            xlink.attributes.byName.title,
            xml.attributes.byName.base,
            /*xml.attributes.byName.id,
            xml.attributes.byName.lang,
            xml.attributes.byName.space*/
        ],
        function (element, errorHandler) {

            for (var i = 0; i < element.children.length; i++) {

                if (element.children[i] instanceof infoset.ElementItem) {

                    /* TODO: missing metadata */

                    if (!(METADATA_CLASS.indexOf(element.children[i].name) !== -1 ||
                        ANIMATION_CLASS.indexOf(element.children[i].name) !== -1 ||
                        element.children[i].name === tt.elements.byName.source.name)) {

                        errorHandler.error("Illegal content");
                        break;

                    }

                }

            }

        }
    )
);


/**
 * data
 */

function _validateDataElement(element, errorHandler) {

    var SIMPLE = 1;
    var CHUNKED = 2;
    var SOURCED = 3;

    /* determine embedding type */

    var etype = 0; /* simple = 1; chunk = 2; sourced = 3 */

    for (var i = 0; i < element.children.length; i++) {

        var c = element.children[i];

        if (c instanceof infoset.CharacterItem) {

            if (c.text.trim().length === 0) {
                continue;
            }

            if (etype !== 0 && etype !== SIMPLE) {
                errorHandler.error("Illegal content");
                return;
            }

            etype = SIMPLE;

        } else if (c.name === tt.elements.byName.chunk.name) {

            if (etype !== 0 && etype !== CHUNKED) {
                errorHandler.error("Illegal content");
                return;
            }

            etype = CHUNKED;

        } else if (c.name === tt.elements.byName.source.name) {

            if (etype !== 0 && etype !== SOURCED) {
                errorHandler.error("Illegal content");
                return;
            }

            etype = SOURCED;

        }

    }

    if (etype === SIMPLE || etype === CHUNKED) {

        if (!(unqual.attributes.byName.type.name in element.attributes)) {
            errorHandler.error("Type attribute missing");
            return;
        }

        if (unqual.attributes.byName.encoding.name in element.attributes) {
            errorHandler.error("Encoding attribute present");
            return;
        }

    }

}

tt.elements.add(
    new model.Element(
        names.NS_TT,
        "data",
        [
            /*unqual.condition,*/
            unqual.attributes.byName.encoding,
            unqual.attributes.byName.format,
            unqual.attributes.byName.length,
            unqual.attributes.byName.src,
            unqual.attributes.byName.type,
            xml.attributes.byName.base/*,
        xml.attributes.idElement,
        xml.attributes.langAttribute,
        xml.attributes.spaceAttribute*/
        ],
        _validateDataElement
    )
);

/**
 *  font 
 */


tt.elements.add(
    new model.Element(
        names.NS_TT,
        "font",
        [
            /*unqual.condition,*/
            /*unqual.attributes.byName.family,*/
            unqual.attributes.byName.range,
            unqual.attributes.byName.style,
            unqual.attributes.byName.src,
            unqual.attributes.byName.type,
            unqual.attributes.byName.weight,
            xml.attributes.byName.base/*,
        xml.attributes.idElement,
        xml.attributes.langAttribute,
        xml.attributes.spaceAttribute*/
        ]
    )
);

/**
 *  animation 
 */

tt.elements.add(
    new model.Element(
        names.NS_TT,
        "animation"
    )
);


function validateBlockClassElement(element, errorHandler) {

    /* ensure no more than one region child element */

    var hasInlineRegion = false;

    for (var i = 0; i < element.children.length; i++) {

        if ((element.children[i] instanceof infoset.ElementItem) &&
            element.children[i].name === tt.elements.byName.region.name) {

            if (hasInlineRegion) {

                errorHandler.error("Too many inline regions");
                break;

            }

            hasInlineRegion = true;

        }

    }

}

/**
 * body
 */

tt.elements.add(
    new model.Element(
        names.NS_TT,
        "body",
        [
            unqual.attributes.byName.begin,
            unqual.attributes.byName.end,
            unqual.attributes.byName.dur,
            tts.attributes.all
        ]
    )
);


/**
 * div
 */

tt.elements.add(
    new model.Element(
        names.NS_TT,
        "div",
        [
            unqual.attributes.byName.begin,
            unqual.attributes.byName.end,
            unqual.attributes.byName.dur,
            tts.attributes.all
        ],
        validateBlockClassElement
    )
);

/**
 * p
 */

tt.elements.add(
    new model.Element(
        names.NS_TT,
        "p",
        [
            unqual.attributes.byName.begin,
            unqual.attributes.byName.end,
            unqual.attributes.byName.dur,
            tts.attributes.all
        ],
        validateBlockClassElement
    )
);



/**
 * span
 */

tt.elements.add(
    new model.Element(
        names.NS_TT,
        "span",
        [
            unqual.attributes.byName.begin,
            unqual.attributes.byName.end,
            unqual.attributes.byName.dur,
            tts.attributes.all,
            xlink.attributes.all
        ],
        function (element, errorHandler) {

            for (var i = 0; i < element.children.length; i++) {

                if (element.children[i] instanceof infoset.ElementItem) {

                    /* TODO: missing metadata */

                    if (!(METADATA_CLASS.indexOf(element.children[i].name) !== -1 ||
                        ANIMATION_CLASS.indexOf(element.children[i].name) !== -1 ||
                        INLINE_CLASS.indexOf(element.children[i].name) !== -1 ||
                        EMBEDDED_CLASS.indexOf(element.children[i].name) !== -1 ||
                        element.children[i].name === tt.elements.byName.source.name)) {

                        errorHandler.error("Illegal content");
                        break;

                    }

                }

            }
        }
    )
);


/**
 * br
 */

tt.elements.add(
    new model.Element(
        names.NS_TT,
        "br"
    )
);

/**
 * 
 * animate
 * 
 */

tt.elements.add(
    new model.Element(
        names.NS_TT,
        "animate",
        [
            unqual.attributes.byName.begin,
            unqual.attributes.byName.calcMode,
            /*unqual.attributes.condition,*/
            unqual.attributes.byName.dur,
            unqual.attributes.byName.end,
            unqual.attributes.byName.fill,
            unqual.attributes.byName.keySplines,
            unqual.attributes.byName.keyTimes,
            unqual.attributes.byName.repeatCount,
            xml.attributes.byName.base,
            /*xml.attributes.idElement,
            xml.attributes.langAttribute,
            xml.attributes.spaceAttribute*/
            tts.attributes.all
        ]
    )
);

/**
 * 
 * set
 * 
 */

tt.elements.add(
    new model.Element(
        names.NS_TT,
        "set",
        [
            unqual.attributes.byName.begin,
            /*unqual.attributes.condition,*/
            unqual.attributes.byName.dur,
            unqual.attributes.byName.end,
            unqual.attributes.byName.fill,
            unqual.attributes.byName.repeatCount,
            xml.attributes.byName.base,
            /*xml.attributes.idElement,
            xml.attributes.langAttribute,
            xml.attributes.spaceAttribute*/
            tts.attributes.all
        ]
    )
);

/**
 * 
 * Element classes
 * 
 */

var ANIMATION_CLASS = [tt.elements.byName.set.name, tt.elements.byName.animate.name];

var INLINE_CLASS = [tt.elements.byName.span.name, tt.elements.byName.br.name];

var METADATA_CLASS = [/* TODO */];

var EMBEDDED_CLASS = [tt.elements.byName.image.name /* TODO: audio*/];

/**
 * 
 * TTML2 Document Type
 * 
 */

ttml2 = new model.Model();


ttml2.addElement(tt.elements.byName.image);
ttml2.addElement(tt.elements.byName.font);

ttml2.addElement(tt.elements.byName.body);
ttml2.addElement(tt.elements.byName.div);
ttml2.addElement(tt.elements.byName.p);
ttml2.addElement(tt.elements.byName.span);
ttml2.addElement(tt.elements.byName.br);

ttml2.addElement(tt.elements.byName.animation);
ttml2.addElement(tt.elements.byName.animate);
ttml2.addElement(tt.elements.byName.set);

ttml2.addElement(tt.elements.byName.tt);
ttml2.addElement(tt.elements.byName.head);

ttml2.addElement(ttp.elements.byName.profile);
ttml2.addElement(ttp.elements.byName.features);
ttml2.addElement(ttp.elements.byName.extensions);

ttml2.addElement(tt.elements.byName.layout);
ttml2.addElement(tt.elements.byName.region);

ttml2.addElement(tt.elements.byName.styling);
ttml2.addElement(tt.elements.byName.style);

ttml2.addElement(tt.elements.byName.resources);
ttml2.addElement(tt.elements.byName.chunk);
ttml2.addElement(tt.elements.byName.data);
ttml2.addElement(tt.elements.byName.source);
ttml2.addElement(tt.elements.byName.image);

/**
 * 
 * Exports 
 * 
 */

module.exports.ttp = ttp;
module.exports.tts = tts;
module.exports.xlink = xlink;
module.exports.xml = xml;
module.exports.unqual = unqual;

module.exports.tt = tt;

module.exports.Model = ttml2;
