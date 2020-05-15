/*=========================================================== [ Sample Module ] =======================================================================*/

(function(ns, $, undefined){
    var Sample = (function(){
        var _init = function(){
            console.log('init module 22.js');
        };

        return {
            init: _init,
        }
    })();

    ns.sample.m22 = Sample;

}(App || {}, jQuery));


