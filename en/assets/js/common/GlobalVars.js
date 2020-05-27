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
                return window.GlobalVars.INDEX_0_SERVER;
            }
            else{
                return window.GlobalVars.INDEX_1_DEV;
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
window.GlobalVars.page_name = "not_defined_yet ";
window.GlobalVars.jsonUrl = {};
window.GlobalVars.json_data_common = {};
window.GlobalVars.json_data_static = {};
window.GlobalVars.device = {"pixel_ratio": window.devicePixelRatio, "isHighDPI": window.devicePixelRatio > 1};

window.GlobalVars.isLogin = false;
window.GlobalVars.COMPLETE_OAUTH = 'complete_oauth';
window.GlobalVars.MIN_AGE = 13;
window.GlobalVars.age = 1;

window.GlobalVars.ALERT_MSG_MIN_AGE = "죄송합니다.\n\n13세 미만일 경우,\n프로그램 신청이 불가능합니다.";
/*window.GlobalVars.ALERT_MSG_PROGRAM_APPLY_COMPLETE_LOGIN = "신청이 완료되었습니다.\n\n마이페이지 > 나의예약내역에서\n신청내역을 확인하실 수 있습니다.";*/
window.GlobalVars.ALERT_MSG_PROGRAM_APPLY_COMPLETE_LOGIN = "신청이 완료되었습니다.\n\n예약 확인이나 취소를 원하실 경우 \n마이페이지 > 나의 예약내역을 확인해주세요.";
window.GlobalVars.ALERT_MSG_PROGRAM_APPLY_COMPLETE_LOGOUT = "신청이 완료되었습니다.\n\n예약관련 문의는 슈퍼셀 라운지\n운영 메일로 연락주시기 바랍니다.\n(contact@supercelllounge.com)";
window.GlobalVars.ALERT_MSG_MIN_TROPHY_START = "죄송합니다.\n\n신청가능한 트로피 점수가 아닙니다.\n";
window.GlobalVars.ALERT_MSG_MIN_TROPHY_MIDDLE = "트로피 이상일 경우에만\n";
window.GlobalVars.ALERT_MSG_MIN_TROPHY_END = "에 신청하실 수 있습니다.\n\n트로피를 좀 더 쌓은 후\n다시 신청해주세요!";
window.GlobalVars.ALERT_MSG_SPACE_APPLY_COMPLETE_LOGIN = "신청이 완료되었습니다.\n\n예약 확인이나 취소를 원하실 경우 \n마이페이지 > 나의 예약내역을 확인해주세요.";
window.GlobalVars.ALERT_MSG_SPACE_APPLY_COMPLETE_LOGOUT = "신청이 완료되었습니다.\n\n예약관련 문의는 슈퍼셀 라운지\n운영 메일로 연락주시기 바랍니다.\n(contact@supercelllounge.com)";
window.GlobalVars.ALERT_MSG_SPACE_APPLY_COMPLETE_CREATOR = "문의가 접수되었습니다.\n확인 후 별도로 연락드리겠습니다.";
window.GlobalVars.ALERT_MSG_CHANGE_PASSWORD_COMPLETE = "새로운 비밀번호가 정상적으로 등록 되었습니다.";
window.GlobalVars.ALERT_MSG_MODIFY_INFO_COMPLETE = "회원정보가 정상적으로 수정 되었습니다.";
window.GlobalVars.ALERT_MSG_NO_PROGRAM = "죄송합니다. \n현재 신청 가능한 프로그램이 없습니다. \n조금만 기다려주세요!";


window.GlobalVars.PAGE_000_MAIN = "/";
window.GlobalVars.PAGE_100_ABOUT = "/about";
window.GlobalVars.PAGE_200_PROGRAM = "/program";
window.GlobalVars.PAGE_300_SPACE = "/space";
window.GlobalVars.PAGE_400_FAQ = "/faq";
window.GlobalVars.PAGE_500_GUIDE = "/guide";
window.GlobalVars.PAGE_900_USER = "/user";

window.GlobalVars.INDEX_0_SERVER = 0;
window.GlobalVars.INDEX_1_DEV = 1;
window.GlobalVars.INDEX_2_LOCAL = 2;
window.GlobalVars.INDEX_3_BACKDATA = 3;

window.GlobalVars.SIZE_MOBILE = 767.98;
window.GlobalVars.SIZE_PC = 1199.98;

window.GlobalVars.POPUP_0_CLOSE = 0;
window.GlobalVars.POPUP_1_NAVI = 1;
window.GlobalVars.POPUP_2_RESERVATION = 2;
window.GlobalVars.POPUP_3_LOGIN = 3;
window.GlobalVars.POPUP_4_INFO_AGREE = 4;
window.GlobalVars.POPUP_5_RESERVATION_CAUTION = 5;

window.GlobalVars.COLOR_0_WHITE = 0;
window.GlobalVars.COLOR_1_BLACK = 1;

window.GlobalVars.container_name = "main";

// ....
// ....
// ....

console.log("GlobalVars.isMobile : " + window.GlobalVars.isMobile);
console.log("GlobalVars.isTablet : " + window.GlobalVars.isTablet);
console.log("GlobalVars.device.isHighDPI : " + window.GlobalVars.device.isHighDPI);




