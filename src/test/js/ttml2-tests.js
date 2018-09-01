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

var assert = require('assert');
var fs = require('fs');
var is = require('../../main/js/infoset');
var validator = require('../../main/js/validator');
var ttml2 = require('../../main/js/ttml2-document-type');

/* TODO: factor out error handler in its own module */

function BinaryErrorHandler() {
    this.isError = null;
}

BinaryErrorHandler.prototype.fatal = function (msg) {
    this.isError = msg;
    return true;
}

BinaryErrorHandler.prototype.error = function (msg) {
    this.isError = msg;
    return true;
}

BinaryErrorHandler.prototype.warn = function (msg) {
    this.isError = msg;
    return true;
}

BinaryErrorHandler.prototype.info = function (msg) {
    return true;
}

var VALID_TEST_FILES_DIR_PATH = 'src/test/resources/ttml2-tests/validation/valid/';
var INVALID_TEST_FILES_DIR_PATH = 'src/test/resources/ttml2-tests/validation/invalid/';

describe('TTML2 Valid Tests', function () {

    var files = fs.readdirSync(VALID_TEST_FILES_DIR_PATH);

    files.forEach(
        function (testname) {
            it(testname, function (done) {
                fs.readFile(
                    VALID_TEST_FILES_DIR_PATH + testname,
                    'utf8',
                    function (err, data) {
                        if (err) {

                            done(err);

                        } else {

                            var handler = new BinaryErrorHandler();

                            var infoset = is.fromXML(data, handler);

                            validator.validate(infoset, ttml2.Model, handler);

                            assert(handler.isError === null, handler.isError);

                            done();

                        };
                    }
                );
            });
        }
    );

});

describe('TTML2 Invalid Tests', function () {

    var files = fs.readdirSync(INVALID_TEST_FILES_DIR_PATH);

    files.forEach(
        function (testname) {
            it(testname, function (done) {
                fs.readFile(
                    INVALID_TEST_FILES_DIR_PATH + testname,
                    'utf8',
                    function (err, data) {
                        if (err) {

                            done(err);

                        } else {

                            var handler = new BinaryErrorHandler();

                            var infoset = is.fromXML(data);

                            validator.validate(infoset, ttml2.Model, handler);

                            assert(handler.isError !== null, handler.isError);

                            done();

                        };
                    }
                );
            });
        }
    );

});


