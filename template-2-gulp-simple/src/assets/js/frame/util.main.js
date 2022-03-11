
/*=========================================================== [ Utils / Resize / Scroll ] =======================================================================*/

(function(ns, $, undefined){
    var UtilMain = (function(){

        var winWidth, winHeight, topH, scrollTop, scrollBottom, scrollLeft,fixedScrollTop;

        // 반응형 디바이스 타입
        var oldDeviceType = '';
        var currentScreenType = '';


        var _init = function(){
            console.log('utilMain init!')
            _addEvent();
            _jQueryExtendUtil();
        }

        var _addEvent = function(){
            _onScroll();
            _onResize();
            _onMouseWheel();
            _setWindowSize();
        };

        var _onScroll = function(){
            $(window).on('scroll', _onScroll_handler)
        };

        var _onResize = function(){
            $(window).on('resize', _onResizeHandler);
        };

        var _onMouseWheel = function(){
            $(window).on(window.GlobalEvent.MOUSE_WHEEL, _onMouseWheelHadler);
        }


        var _onScroll_handler = function(e){
            var doc = document.documentElement;
            var top = window.GlobalVars.WindowInfo.top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
            var left = (window.pageXOffset || doc.scrollLeft)  - (doc.clientLeft || 0);
            var bottom =  top + winHeight;

            // custom Event
            $(window.GlobalEvent).trigger(window.GlobalEvent.SCROLL,{top:top, left:left, bottom: bottom});

            window.GlobalVars.getScrollTop = scrollTop = top;
        };

        var _onResizeHandler = function(){
            _setWindowSize();
        };

        var _setWindowSize = function(){

            window.GlobalVars.WindowInfo.width = winWidth = (window.innerWidth || document.documentElement.clientWidth);
            window.GlobalVars.WindowInfo.height = winHeight = (window.innerHeight || document.documentElement.clientHeight);

            _checkScreenType();
            $(window.GlobalEvent).trigger(window.GlobalEvent.RESIZE,{width:winWidth, height:winHeight});

        };

        var _checkScreenType = function(){
            if(winWidth < window.GlobalVars.BreakPoint.TABLET){ //768
                currentScreenType = window.GlobalVars.DeviceType.MOBILE;
            }else {
                currentScreenType = window.GlobalVars.DeviceType.DESKTOP;
            }

            window.GlobalVars.CurrentScreenType = currentScreenType;

            if(oldDeviceType !== currentScreenType) {
                //console.log('currentScreen', oldDeviceType,':', window.GlobalVars.CurrentScreenType)
                $(window.GlobalEvent).trigger(window.GlobalEvent.CHANGE_DEVICE_SIZE/*,{device : currentScreenType}*/);
            }

            oldDeviceType = currentScreenType;

            window.GlobalVars.OldScreenType = oldDeviceType;
        };

        var _checkCurrentPageType = function($parm){
             return $('.sdp-container').hasClass($parm);
        };

        var _onMouseWheelHandler = function(e){
            var evt = e.originalEvent;
            var delta = 0;
            var direction;
            if (evt.detail) {
                delta = evt.detail * -40;
            }else{
                delta = evt.wheelDelta;
            };
            //console.log('Detectizr.os.name', Detectizr.os.name)
            if(Detectizr.os.name === 'mac os'){
                if(delta > 0){
                    //console.log('MAC mousewheel down')
                    direction = 'down';
                }else{
                    //console.log('MAC mousewheel up')
                    direction = 'up';
                }
            }else{
                if(delta > 0){
                    direction = 'up';
                }else{
                    direction = 'down';
                }
            }

            $(window.GlobalEvent).trigger(window.GlobalEvent.MOUSE_WHEEL,{dir: direction });
        };

        var _setFixed = function($type) {
            var time=0;
            fixedScrollTop = scrollTop;

            if(scrollTop < window.GlobalVars.headerH) {
                fixedScrollTop = 0;
                time = 600;
            }

            $('body').addClass('fixed');
            $('body').stop().animate({
                'margin-top': -fixedScrollTop
            }, time);


            window.GlobalVars.getFixedScrollTop = fixedScrollTop;

            switch ($type) {
                case window.GlobalVars.fixedType.SUBNAV :

                    $('#el-top-title-nav').css('z-index',1500);

                    break;
            }

        };

        var _removeFixed = function() {
            $('body').removeClass('fixed');
            $('body').css('margin-top' ,0);

            $('html, body').stop().animate({
                scrollTop: fixedScrollTop
            }, 0,function() {
                _onScroll_handler();

            });
            window.GlobalVars.getFixedScrollTop = 0;

            $('#el-top-title-nav').css('z-index',200);
        };


        // jQuery Plugin Extend//
        var _jQueryExtendUtil = function(){
            // scroll 존재 체크 jQuery plugIn
            $.fn.hasHorizontalScrollBar = function() {
                return this.get(0) ? this.get(0).scrollWidth > this.innerWidth() : false;
            };

            $.fn.hasVerticalScrollBar = function() {
                return this.get(0) ? this.get(0).scrollHeight > this.innerHeight() : false;
            };
        };




        return {
            init : _init,
            checkPageType : _checkCurrentPageType,
            setFixed : _setFixed,
            removeFixed : _removeFixed
        }
    })();
    ns.utils = UtilMain;

}(window || {}, jQuery));
