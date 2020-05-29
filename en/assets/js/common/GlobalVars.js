/*window.GlobalVars = (function () {
    //sever check
    var _getServerIndex = function () {

        var locate = location.href;
        var isLocal = (/^127|^192|localhost/).test(document.location.hostname);
        if (!isLocal) {
            if(locate.indexOf('/dev/') == -1) {

            }
            else{

            }

        }else{

        }
    }


    return {
        //PC에서 모바일 환경
        isSizeMobile : false,

    };

})();*/

window.GlobalVars = window.GlobalVars || {};
window.GlobalVars = {
    DEVICE : {"pixel_ratio": window.devicePixelRatio, "isHighDPI": window.devicePixelRatio > 1},

    IS_SIZE_MOBILE : false,
    IS_SIZE_TABLET : false,

    SIZE_MOBILE : 767.98,
    SIZE_PC : 1199.98,

    THEME:{
        COLOR_A_WHITE: 'white',
        COLOR_A_BLACK: 'black',
    }

};



// ....
// ....
// ....
console.log("GlobalVars.device.isHighDPI : " + window.GlobalVars.DEVICE.isHighDPI);




