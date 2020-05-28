window.GlobalVars = (function () {
    // is Mobile
    var _detectClass = document.querySelector('html').className;
    var _isMobile = _detectClass.indexOf("mobile") == -1 ? false : true;

    var _isTablet = false;
    if (!_isMobile) {
        if (_detectClass.indexOf("tablet") == -1) {
            _isTablet = false;
        } else {
            _isTablet = _detectClass.indexOf("ie") == -1 ? true : false;
        }
    } else _isTablet = false;

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
            return window.GlobalVars.INDEX_2_LOCAL;
        }
    }


    return {

        // 모바일 디바이스 유무
        isMobile: _isMobile,
        isTablet: _isTablet,
        //PC에서 모바일 환경
        isSizeMobile : false,

    };

})();



// 그밖에 변수값 저장
window.GlobalVars.device = {"pixel_ratio": window.devicePixelRatio, "isHighDPI": window.devicePixelRatio > 1};

window.GlobalVars.SIZE_MOBILE = 767.98;
window.GlobalVars.SIZE_PC = 1199.98;

window.GlobalVars.COLOR_0_WHITE = 0;
window.GlobalVars.COLOR_1_BLACK = 1;


// ....
// ....
// ....

console.log("GlobalVars.isMobile : " + window.GlobalVars.isMobile);
console.log("GlobalVars.isTablet : " + window.GlobalVars.isTablet);
console.log("GlobalVars.device.isHighDPI : " + window.GlobalVars.device.isHighDPI);




