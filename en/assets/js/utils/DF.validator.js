
var validator = (function (){

    ////////////////////////////////////////////////////////////////////

    // 한글만 체크
    function _lan_kr(str){
        var regexp = /^[가-힣]+$/;
        if(!regexp.test(str)){
            return false;
        }
        return true;
    }

    // 숫자만 체크
    function _only_number(str){
        var regexp = /^[0-9]+$/;
        if(!regexp.test(str)){
            return false;
        }
        return true;
    }

    // 전화번호 형식 체크
    function _phone_number(str){
        var regexp = /^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/
        if(!regexp.test(str)){
            return false;
        }
        return true;
    }

    // 전화번호 숫자만 체크
    function _phone_only_number(str){
        var regexp = /^01([0|1|6|7|8|9])([0-9]{3,4})([0-9]{4})$/
        //var regexp = /^\d{3}\d{3,4}\d{4}$/;
        if(!regexp.test(str)){
            return false;
        }
        return true;
    }

    // 이메일 체크
    function _email(str){
        var regexp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
        if(!regexp.test(str)){
            return false;
        }
        return true;
    }

    // 공백 체크
    function _blank(str){
        if(str.search(/\s/) != -1){
            return false;
        }

        return true;
    }


    return {
        lan_kr : _lan_kr,
        only_number : _only_number,
        phone_number : _phone_number,
        phone_only_number : _phone_only_number,
        blank : _blank
    }
})();

(function(){

    if(window.DF == undefined) window.DF = {};
    window.DF.validator = validator;

})();