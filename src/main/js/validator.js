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

var model = require("./ttml2-document-type");
var infoset = require("./infoset");

module.exports.validate = validate;

function validate(infoset, model, errorHandler) {

    validateElement(infoset, model, errorHandler);

}


function validateElement(element, model, errorHandler) {

    var e = model.getElement(element.uri, element.local);

    /* prune elements for which there is no model */

    if (e) {

        /* validate attributes */

        for(var attr_i in element.attributes) {

            var a = e.getAttribute(element.attributes[attr_i].uri, element.attributes[attr_i].local);

            /* prune attributes for which there is no model */

            if (a) {

                a.validate(element.attributes[attr_i], errorHandler);

            }

        }

        /* validate contents */

        e.validate(element, errorHandler);

        for(var i = 0; i < element.children.length ; i++) {

            if (element.children[i] instanceof infoset.ElementItem) {

                validateElement(element.children[i], model, errorHandler);

            }

        }
    }

}