/*=========================================================== [ UI ] =======================================================================*/
define(['app'], function (App) {
    const UI = (function (ns) {
        let gnbNavItem;

        let scrollTop, scrollBottom, oldScrollTop, isScrolling, preScrollTime = 0, currentScrollTime;
        let arrSectionOffsetTop =[];
        const _init = function () {

            console.log('UI Start')
            _onChangeDeviceSizeHandler();

            $(window.GlobalEvent).on(window.GlobalEvent.CHANGE_SCROLL, _onScrollHandler);
``
            $(window.GlobalEvent).on(window.GlobalEvent.CHANGE_DEVICE_SIZE, _onChangeDeviceSizeHandler)

            // $(window).mousewheel(function(e){
            //     console.log('mouse wheel e:',e.target,'e:currentTarget-', e.currentTarget, e)
            // })



            //dom
            gnbNavItem = $('.gnb .nav-item')
            gnbNavItem.find('.nav-link').on({
                click: _onClickGnbMenuHandler
            });

            setTimeout(function(){
                _setSectionOffsetTop();
                _onScrollHandler(undefined);
            },150);

        };

        //$(window).scroll(()=> console.log('windowScroll', $(window).scrollTop()))

        let secCount = 0;
        const _onScrollHandler = function(e, $val){

            if(typeof e !== "undefined") {
                scrollTop = Math.round($val);
            }else{
                scrollTop = Math.round($(window).scrollTop());
            }
            scrollBottom = scrollTop + $(window).height();
            
            oldScrollTop = scrollTop;


            // preScrollTime = currentScrollTime;
            // currentScrollTime = e.timeStamp;

           //console.log('time', preScrollTime, currentScrollTime)
            //if(currentScrollTime - preScrollTime <100) isScrolling = true;
           //_headerFixed()

            _setSectionOffsetTop();
            _activeGnbMenu()
            
            //4번째 섹션에 들어오면 윈도우 스크롤 잠금, 내부 커스텀 스크롤 사용
            if(scrollTop > arrSectionOffsetTop[3] && scrollTop < arrSectionOffsetTop[3]*1.015){
                //$(window).scrollTop(arrSectionOffsetTop[3]); // 네번째 섹션에 걸리도록 스냅 적용
            }



            //console.log('scrollTop', arrSectionOffsetTop[3], scrollTop)
            if(scrollTop >= arrSectionOffsetTop[3] && scrollTop < arrSectionOffsetTop[4]*0.8){
                console.log('4번째 섹션 접근, 스크롤 잠금')
                $('body').addClass('overflow-hidden');
                $('.sec-4 .inner-wrap').addClass('fixed');

                $('.sec-4 .inner-wrap').on('mousewheel.inner-scroll', function(e) {
                    if(secCount >= 0 && secCount < $('.sec-4 .sub-sec').length-1 ){
                        if (e.originalEvent.deltaY < 0) {
                            //scroll up
                            $('.sec-4 .inner-wrap').stop().animate({scrollTop: '-=' + $(window).height()}, 500, function () {
                                $('.sec-4 .sub-sec:not(:first-child)').eq(secCount--).css({
                                    opacity: 0
                                })
                            });
                        } else {
                            //scroll down
                            $('.sec-4 .inner-wrap').stop().animate({scrollTop: '+=' + $(window).height()}, 500, function () {
                                $('.sec-4 .sub-sec').eq(++secCount).css({
                                    opacity: 1
                                })
                            });
                        }

                        //prevent page fom scrolling
                        return false;
                    }else{
                        console.log('end secCount', secCount)
                        $('.sec-4 .inner-wrap').scrollTop(0).off('mousewheel.inner-scroll');
                        $('.sec-4 .inner-wrap .sub-sec').removeAttr('style');
                        $('.sec-4 .inner-wrap').removeClass('fixed');
                        $('body').removeClass('overflow-hidden');


                        
                    }

                });
            }else{
                // 서브섹션 카운트용 변수 초기화
                if(secCount == $('.sec-4 .sub-sec').length-2){

                    $(window).scrollTop(arrSectionOffsetTop[4]);
                }
                secCount =0;
            }
        };


        _onClickGnbMenuHandler = function(e){
            e.preventDefault();
            var self = $(this);

            console.log('aaaa', $(this).parent().index())
            $('html, body').animate(
                {
                    scrollTop: arrSectionOffsetTop[$(this).parent().index()]
                },
                300,
                function(){
                    self.closest('.nav-bar').find('a').removeClass('active');
                    self.addClass('active');
                    window.history.pushState('', '',  self.attr('href'));
                }
            );

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


        var _activeGnbMenu = function(){
            //console.log('_activeGnbMenu', scrollTop, arrSectionOffsetTop)
            gnbNavItem.find('.nav-link').removeClass('active');
            var arrLength = arrSectionOffsetTop.length;
            //console.log('_activeTocMenu' , gnbNavItem, scrollTop, scrollBottom)
            for(var i= 0, leng = arrLength; i < leng; i++){
                if(scrollTop >= arrSectionOffsetTop[0] && scrollTop < arrSectionOffsetTop[1]) {
                    //console.log('first')
                    gnbNavItem.eq(0).find('.nav-link').addClass('active');
                }else if(scrollTop >= arrSectionOffsetTop[i+1] && scrollTop < arrSectionOffsetTop[i+2]){
                    //console.log('middle')
                    gnbNavItem.eq(i+1).find('.nav-link').addClass('active');
                }else if(scrollTop >= arrSectionOffsetTop[i+2] && (scrollTop >= arrSectionOffsetTop[arrLength-1])){
                    //console.log('last')
                    gnbNavItem.eq(arrLength - 1).find('.nav-link').addClass('active');
                }
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

        const _setSectionOffsetTop = function(){
            if( arrSectionOffsetTop.length > 0) arrSectionOffsetTop = [];
            $('section').each(function(){
                arrSectionOffsetTop.push(Math.round($(this).offset().top))
            })
        };



        return {
            init: _init,
            ui_main_fn: _uiMainFn
        }
    })(App);

    App.ui.main = UI;
});

