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
var is = require('../src/main/js/infoset');
var validator = require('../src/main/js/validator');
var ttml2 = require('../src/main/js/ttml2-document-type');

/* TODO: factor out error handler in its own module */

function BinaryErrorHandler() {
    this.isError = false;
}

BinaryErrorHandler.prototype.fatal = function (msg) {
    this.isError = true;
    return true;
}

BinaryErrorHandler.prototype.error = function (msg) {
    this.isError = true;
    return true;
}

BinaryErrorHandler.prototype.warn = function (msg) {
    this.isError = true;
    return true;
}

BinaryErrorHandler.prototype.info = function (msg) {
    return true;
}

var VALID_TEST_FILES_DIR_PATH = 'src/test/resources/ttml2-tests/validation/valid/';
var INVALID_TEST_FILES_DIR_PATH = 'src/test/resources/ttml2-tests/validation/invalid/';
var TESTS_LISTS_PATH = 'src/test/resources/ttml2-tests/validation/tests.json';

var tests = JSON.parse(fs.readFileSync(TESTS_LISTS_PATH));

var valid_files = fs.readdirSync(VALID_TEST_FILES_DIR_PATH);
var invalid_files = fs.readdirSync(INVALID_TEST_FILES_DIR_PATH);

var test_results = {};

valid_files.forEach(
    function (testfilename) {

        var data = fs.readFileSync(
            VALID_TEST_FILES_DIR_PATH + testfilename,
            'utf8');

        var handler = new BinaryErrorHandler();

        var infoset = is.fromXML(data, handler);

        validator.validate(infoset, ttml2.Model, handler);

        /* remove .xml extension */
            
        var testname = testfilename.slice(0, -4);

        test_results[testname] = handler.isError === false;
    }
);

invalid_files.forEach(
    function (testfilename) {

        var data = fs.readFileSync(
            INVALID_TEST_FILES_DIR_PATH + testfilename,
            'utf8');

        var handler = new BinaryErrorHandler();

        var infoset = is.fromXML(data, handler);

        validator.validate(infoset, ttml2.Model, handler);

        /* remove .xml extension */
            
        var testname = testfilename.slice(0, -4);

        test_results[testname] = handler.isError === true;
    }
);

var report = {};

for(var feature in tests) {

    var passed = true;

    for(var i = 0; i < tests[feature].valid.length; i++) {

        if (tests[feature].valid[i]['exclude']) continue;

        passed = test_results[tests[feature].valid[i].test];

        if (passed === false) {
            break;
        }

    }

    if (passed) {
        for(var i = 0; i < tests[feature].invalid.length; i++) {

            if (tests[feature].invalid[i]['exclude']) continue;

            passed = test_results[tests[feature].invalid[i].test];

            if (passed === false) {
                break;
            }

        }
    }


    report[feature] = passed ? "X" : "";

}

for(var feature in report) {

    process.stdout.write(feature + "\t" + report[feature] + "\n");

}


