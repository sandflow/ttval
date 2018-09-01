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

%%

\s+                     ;
"||"                    return '||';
"&&"                    return '&&';
"=="                      return '==';
"!="                    return '!=';
"<"                       return '<';
">"                       return '>';
"<="                      return '<=';
">="                      return '>=';
"+"                      return '+';
"-"                      return '-';
"*"                      return '*';
"/"                      return '/';
"%"                       return '%';
"!"                       return '!';
"("                      return '(';
")"                      return ')';
"media("                return 'media-function-start';
"parameter("                        return 'parameter-function-start';
"supports("                        return 'supports-function-start';
[A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][-.0-9A-Z_a-z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]*              return 'identifier';
true|false              return 'boolean-literal';
(((0|([1-9]\d*))(\.\d*)?)|(\.\d*))([eE][+-]?\d+)?   return 'decimal-literal'
\"(\\.|[^"\\])*\"       return 'double-quoted-string';
\'(\\.|[^'\\])*\'       return 'single-quoted-string';


%%