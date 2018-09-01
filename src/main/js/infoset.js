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

var sax = require("sax");
var utils = require("./utils");

module.exports.fromXML = fromXML;

function fromXML(xmlstring, errorHandler) {

    var p = sax.parser(true /* strict mode */, {xmlns: true});

    var is = null;

    var istack = [];

    p.onerror = function (e) {
        reportError(errorHandler, e);
    };

    p.ontext = function (t) {
        if (istack.length > 0 && istack[0] instanceof ElementItem) {
            istack[0].children.push(new CharacterItem(t));
        }
    };

    p.onopentag = function (node) {

        var parent = istack.length > 0 ? istack[0] : null;

        var e = new ElementItem(node.uri, node.local, parent);

        if (parent === null) {
            is = e;
        } else {
            parent.addChild(e);
        }

        for(var i in node.attributes) {
            e.addAttribute(
                new AttributeItem(
                    node.attributes[i].uri,
                    node.attributes[i].local, 
                    node.attributes[i].value,
                    e
                )
            );
        }

        istack.unshift(e);
    };

    p.onclosetag = function (node) {
        istack.shift();
    };

    p.write(xmlstring).close();

    return is;

}

function reportError(errorHandler, msg) {

    if (errorHandler && errorHandler.error && errorHandler.error(msg))
        throw msg;

}

/**
 * ElementItem
 */

module.exports.ElementItem = ElementItem;

function ElementItem(uri, local, parent) {
    this.name = utils.makeCanonicalName(uri, local);
    this.uri = uri;
    this.local = local;
    this.parent = parent;
    this.children = [];
    this.attributes = {};
}

ElementItem.prototype.addAttribute = function(attr) {
    this.attributes[attr.name] = attr;
};

ElementItem.prototype.addChild = function(child) {
    this.children.push(child);
};

/**
 * AttributeItem
 */

module.exports.AttributeItem = AttributeItem;

function AttributeItem(uri, local, value, parent) {
    this.name = utils.makeCanonicalName(uri, local);
    this.uri = uri;
    this.local = local;
    this.value = value;
    this.parent = parent;
}

/**
 * CharacterItem
 */

module.exports.CharacterItem = CharacterItem;

/* TODO: does character need a parent property */

function CharacterItem(text) {
    this.text = text;
}