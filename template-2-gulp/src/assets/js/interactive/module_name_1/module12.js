/*=========================================================== [ Sample Module ] =======================================================================*/

(function(ns, $, undefined){
    var Sample = (function(){
        var _init = function(){
            console.log('init module 12.js');
        };

        return {
            init: _init,
        }
    })();

    ns.sample.m12 = Sample;

}(App || {}, jQuery));


