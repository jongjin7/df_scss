/*=========================================================== [ Define App's Object ] =======================================================================*/

if (typeof window.App == 'undefined' || !window.App) {
    window.App = {};
    App.utils = {};
    App.loader = {};
    App.contents = {};
}


/*=========================================================== [ App Start ] =======================================================================*/
(function(ns, $, undefined){
    const Common = (function(){
        const _init = function(){
            // modules for App
            App.contents.m11.init();
            App.contents.m12.init();
            App.contents.m21.init();
            App.contents.m22.init();

            // Default
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

