/*
 /////////////////////////////////////////////////////////////////////////////////////////
 @ apiName : viewportApi
 @ date : 2020.05
 @ version : 1.2
 ////////////////////////////////////////////////////////////////////////////////////////
 */
(function(){
    $(function(){
        //console.log('Detectizr::=>', Detectizr.os.name, Detectizr.device.type, Detectizr.browser.userAgent)
        if(Detectizr.device.type == 'tablet') {
           window.addEventListener('orientationchange', changeOrientation, false );
            changeOrientation();

            function changeOrientation() {
                if (Detectizr.os.name == 'android' && (/shw-m480w/i).test(Detectizr.browser.userAgent) && !(/chrome/i).test(Detectizr.browser.userAgent)) {
                    return true;
                }

                var deg = window.orientation;
                var winW =  window.screen.width;
                var setHeight = 1024;
                var ratio;
                var viewPort = document.querySelector('meta[name=viewport]');

                if ((Detectizr.os.name == 'android' && (deg == 90 || deg == -90)) || Detectizr.os.name == 'ios' && (deg == 0 || deg ==180)) {
                    ratio = Math.floor( winW / setHeight * 1000 ) / 1000;
                    viewPort.setAttribute('content', 'width='+ winW +', initial-scale=' + ratio + ', minimum-scale=' + ratio  + ', maximum-scale=' + ratio  + ', user-scalable = no');
                }else{
                    viewPort.setAttribute('content', 'width= deviceWidth, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable = no');
                }
            }
        }
    })
}());


