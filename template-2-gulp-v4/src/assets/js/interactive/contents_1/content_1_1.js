/*=========================================================== [ Sample Module ] =======================================================================*/

(function(ns, $, undefined){
    var ContentModule_11 = (function(){
        var _init = function(){
            console.log('init sub content #11.js');
        };

        return {
            init: _init,
        }
    })();

    ns.contents.m11 = ContentModule_11;

}(App || {}, jQuery));


