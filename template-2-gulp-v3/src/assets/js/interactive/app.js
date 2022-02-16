/*=========================================================== [ Define App's Object ] =======================================================================*/

if (typeof window.App == 'undefined' || !window.App) {
    window.App = {};
    App.utils = {};
    App.sample = {};
}


/*=========================================================== [ App Start ] =======================================================================*/
(function(ns, $, undefined){
    var Common = (function(){
        var _init = function(){

            // for App
            App.sample.m11.init();
            App.sample.m12.init();
            App.sample.m21.init();
            App.sample.m22.init();

            App.utils.main.init();
        };

        return {
            init: _init,
        }
    })();

    ns.common = Common;

}(App || {}, jQuery));


$(document).ready(function(){
    App.common.init();
    $('#app').addClass('show');
    //$('body').css('background-color', '#000000');
});

