
const utils = (function (){

    ////////////////////////////////////////////////////////////////////
    // add class FN
    function _toggleClass(element, className) {
        const check = new RegExp("(\\s|^)" + className + "(\\s|$)");
        if (check.test(element.className)) {
            element.className = element.className.replace(check, " ").trim();
        }else {
            element.className += " " + className;
        }
    }

    function _addClass(element, className) {
        const check = new RegExp("(\\s|^)" + className + "(\\s|$)");
        if (!check.test(element.className)) {
            element.className += " " + className;
        }
    }

    function _removeClass(element, className) {
        const check = new RegExp("(\\s|^)" + className + "(\\s|$)");
        element.className = element.className.replace(check, " ").trim();
    }

    function _hasClass(element, className){
        return new RegExp('(\\s|^)' + className + '(\\s|$)').test(element.className)
    }

    // < EVENT Trigger >
    // Usage example :
    // var el = document.querySelector('input[type="text"]');
    // triggerEvent(el, 'mousedown');

    function _triggerEvent(el, type){
        if ('createEvent' in document) {
            // modern browsers, IE9+
            const e = document.createEvent('HTMLEvents');
            e.initEvent(type, false, true);
            el.dispatchEvent(e);
        } else {
            // IE 8
            const e = document.createEventObject();
            e.eventType = type;
            el.fireEvent('on'+e.eventType, e);
        }
    }

    function _addParamsUrl($url, $name, $value){
        let url = $url;
        let arr_hash = url.split("#")

        if(arr_hash.length >1){
            if(arr_hash[0].indexOf("?") > -1)   url = arr_hash[0] + "&";
            else                        url = arr_hash[0] + "?";
            url = url + $name + "=" + $value+"#"+arr_hash[1];
        }else{
            if(url.indexOf("?") > -1)   url = url + "&";
            else                        url = url + "?";
            url = url + $name + "=" + $value;
        }

        return url;
    }


    // 현재 스크롤 Y 값
    function _getScrollPosY() {
        const doc = document.documentElement;
        const top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
        return top;
    }

    function _scrollTo(element, to, duration) {
        if (duration < 0) return;
        const difference = to - element.scrollTop;
        const perTick = difference / duration * 2;

        setTimeout(function () {
            element.scrollTop = element.scrollTop + perTick;
            scrollTo(element, to, duration - 2);
        }, 10);
    }

    function _getOffset( el ) {
        let _x = 0;
        let _y = 0;
        while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
            _x += el.offsetLeft - el.scrollLeft;
            _y += el.offsetTop - el.scrollTop;
            el = el.offsetParent;
        }
        return { top: _y, left: _x };
    }

    function _maxLengthCheck(object){
        if (object.value.length > object.maxLength){
            object.value = object.value.slice(0, object.maxLength);
        }
    }


    return {
        toggleClass : _toggleClass,
        addClass : _addClass,
        removeClass : _removeClass,
        hasClass : _hasClass,
        triggerEvent : _triggerEvent,
        addParamsUrl : _addParamsUrl,
        getScrollPosY : _getScrollPosY,
        scrollTo : _scrollTo,
        getOffset : _getOffset,
        maxLengthCheck : _maxLengthCheck
    }
})();

(function(){
    if(window.DF == undefined) window.DF = {};
    window.DF.utils = utils;

})();
