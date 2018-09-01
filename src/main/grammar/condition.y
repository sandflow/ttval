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

expression: 
            logical-or-expression
            ;

logical-or-expression:  
                        logical-and-expression
                        | logical-or-expression "||" logical-and-expression
                        ;

logical-and-expression:     
                            equality-expression
                            | logical-and-expression "&&" equality-expression
                            ;

equality-expression:        
                            relational-expression
                            | equality-expression "==" relational-expression
                            | equality-expression "!=" relational-expression
                            ;

relational-expression:      
                            additive-expression
                            | relational-expression "<" additive-expression
                            | relational-expression ">" additive-expression
                            | relational-expression "<=" additive-expression
                            | relational-expression ">=" additive-expression
                            ;

additive-expression:        
                            multiplicitive-expression
                            | additive-expression "+" multiplicitive-expression
                            | additive-expression "-" multiplicitive-expression
                            ;

multiplicitive-expression:  
                            unary-expression
                            | multiplicitive-expression "*" unary-expression
                            | multiplicitive-expression "/" unary-expression
                            | multiplicitive-expression "%" unary-expression
                            ;

unary-expression:           
                            primary-or-function-expression
                            | "+" unary-expression
                            | "-" unary-expression
                            | "!" unary-expression
                            ;

primary-or-function-expression: 
                                primary-expression
                                | function-expression
                                ;

primary-expression: 
                    identifier
                    | literal
                    | "(" expression ")"
                    ;

function-expression:    
                        media-function-start string-literal ")"
                        | parameter-function-start string-literal ")"
                        | supports-function-start string-literal ")"
                        ;

argument-list:  
                expression    
                | argument-list "," expression
                ;

literal: 
            boolean-literal
            | numeric-literal
            | string-literal
            ;

numeric-literal: 
                decimal-literal
                ;

string-literal:         
                        single-quoted-string
                        | double-quoted-string
                        ;

