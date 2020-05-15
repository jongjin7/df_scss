/*=========================================================== [ Define App's Object ] =======================================================================*/

if (typeof window.SdpApp == 'undefined' || !window.SdpApp) {
    window.SdpApp = {};
    SdpApp.utils = {};
    SdpApp.ui = {};
    SdpApp.search = {}
}


/*=========================================================== [ App Start ] =======================================================================*/
(function(ns, $, undefined){
    var Common = (function(){
        var _init = function(){
            // for Util Modules

            SdpApp.utils.inlineSvgIcon.init();

            // for App
            SdpApp.gnb.init();
            SdpApp.top_nav.init();

            SdpApp.ui.main.init();
            SdpApp.search.main.init();

            SdpApp.utils.main.init();

        }

        return {
            init: _init,
        }
    })();

    ns.common = Common;

}(SdpApp || {}, jQuery));


$(function () {




});


$(document).ready(function(){
    SdpApp.common.init();

});
$( window ).on( "load", function(){

    $('#app').addClass('show');
    $('body').css('background-color', '#000000');

} );
