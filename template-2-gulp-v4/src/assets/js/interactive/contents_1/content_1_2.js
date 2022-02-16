/*=========================================================== [ Sample Module ] =======================================================================*/

(function(ns, $, undefined){
    var ContentModule_12 = (function(){
        var _init = function(){
            console.log('init sub content #12.js');
        };

        return {
            init: _init,
        }
    })();

    ns.contents.m12 = ContentModule_12;

}(App || {}, jQuery));


