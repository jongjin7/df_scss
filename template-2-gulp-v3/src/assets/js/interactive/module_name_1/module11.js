/*=========================================================== [ Sample Module ] =======================================================================*/

(function(ns, $, undefined){
    var Sample = (function(){
        var _init = function(){
            console.log('init module 11.js');
        };

        return {
            init: _init,
        }
    })();

    ns.sample.m11 = Sample;

}(App || {}, jQuery));


