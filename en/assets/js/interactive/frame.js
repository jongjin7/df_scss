/*=========================================================== [ UI ] =======================================================================*/
define(['app'], function (App) {
    const UI = (function (ns) {
        let scrollTop, oldScrollTop, isScrolling, preScrollTime = 0, currentScrollTime;
        const _init = function () {

            console.log('UI Start')
            _onChangeDeviceSizeHandler();

            $(window.GlobalEvent).on(window.GlobalEvent.CHANGE_SCROLL, _onScrollHandler);

            $(window.GlobalEvent).on(window.GlobalEvent.CHANGE_DEVICE_SIZE, _onChangeDeviceSizeHandler)

            // $(window).mousewheel(function(e){
            //     console.log('mouse wheel e:',e.target,'e:currentTarget-', e.currentTarget, e)
            // })

        };

        //$(window).scroll(()=> console.log('windowScroll', $(window).scrollTop()))

        const _onScrollHandler = function(e, $val){
            oldScrollTop = scrollTop;
            scrollTop = Math.round($val);

            preScrollTime = currentScrollTime;
            currentScrollTime = e.timeStamp;

            console.log('time', preScrollTime, currentScrollTime)
            if(currentScrollTime - preScrollTime <100) isScrolling = true;
                _headerFixed()

        };

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


        const _onChangeDeviceSizeHandler = function() {
            if(window.GlobalVars.isSizeMobile) {
                _addEvent_NonDeskTop();
                _setBannerMobileImage();

            }else {
                _checkOpenedMobileGnb();
                _setBannerDesktopImage();

            }


        };




        const _addEvent_NonDeskTop = function() {
            console.log('mobile event')
            // toggleMobileGnb.on({
            //     click : _onClickToggleMobileGnbHandler
            // });


        };

        /// image change
        const _setBannerDesktopImage = function(){
            console.log('pc image')
            $.each($('.js-change-img'), function(){
                $(this).css({
                    backgroundImage: 'url('+ $(this).data('pc-image') +')'
                })
            })
        };

        const _setBannerMobileImage = function(){
            console.log('mobile image')
            $.each($('.js-change-img'), function(){
                $(this).css({
                    backgroundImage: 'url('+ $(this).data('mobile-image') +')'
                })
            })
        };

        var _checkOpenedMobileGnb = function(){
            console.log('opened Mobile Gnb')

        }

        var _uiMainFn = function (take) {
            console.log(take + '외부로 노출된 함수 uiMainFn');
        };

        const _headerFixed = function(){
            console.log('scrollTop', scrollTop)
            if(scrollTop > 400 ) {
                if(scrollTop < oldScrollTop){
                    console.log('oldScroll 위로')
                    $('header .inner-wrap').css('top', 0);
                }else{
                    console.log('oldScroll 아래로')
                    $('header .inner-wrap').css('top', -100);
                }
            }


        };



        return {
            init: _init,
            ui_main_fn: _uiMainFn
        }
    })(App);

    App.ui.main = UI;
});

