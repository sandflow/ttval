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

var makeCanonicalName = require("./utils").makeCanonicalName;

/**
 * 
 * Object model
 * 
 */

module.exports.Model = Model;

function Model() {
    this.elements = {};
}

Model.prototype.addElement = function(element) {
    this.elements[element.name] = element;
};

Model.prototype.getElement = function(uri, local) {
    return this.elements[makeCanonicalName(uri, local)];
};

/**
 * 
 * Element object model
 * 
 */

module.exports.Element = Element;

function Element(uri, local, attrs, validationFunction) {
    this.uri = uri;
    this.local = local;
    this.name = makeCanonicalName(uri, local);
    this.validate = validationFunction || function() {return true;};
    this.attributes = {};

    this.addAttributes(attrs);
}

Element.prototype.addAttributes = function(attributes) {

    if (Array.isArray(attributes)) {

        for (var i = 0; i < attributes.length; i++) {

            Element.prototype.addAttributes.call(this, attributes[i]);

        }

    } else if (attributes) {

        this.attributes[attributes.name] = attributes;
    
    }
};

Element.prototype.getAttribute = function(uri, local) {
    return this.attributes[makeCanonicalName(uri, local)];
};

/**
 * 
 * Attribute object model
 * 
 */

module.exports.Attribute = Attribute;

function Attribute(uri, local, validationFunction) {
    this.uri = uri;
    this.local = local;
    this.name = makeCanonicalName(uri, local);
    this.validate = validationFunction || function() {return true;};
}

