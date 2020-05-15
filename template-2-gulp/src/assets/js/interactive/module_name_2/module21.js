/*=========================================================== [ Sample Module ] =======================================================================*/

(function(ns, $, undefined){
    var Sample = (function(){
        var _init = function(){
            console.log('init module 21.js');
        };

        return {
            init: _init,
        }
    })();

    ns.sample.m21 = Sample;

}(App || {}, jQuery));


