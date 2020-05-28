/*=========================================================== [ UI ] =======================================================================*/
define(function () {
    const UI = (function (ns) {
        var _init = function () {

            console.log('UI Start')


            //window.Layout.reset();

            $(window.GlobalEvent).on(window.GlobalEvent.CHANGE_SCROLL, function(e, gap){
                console.log('custom Scroll', gap)
            })

            $(window.GlobalEvent).on(window.GlobalEvent.CHANGE_DEVICE_SIZE, function(e, gap){
                //console.log('custom resize', gap)
            })

            $(window.GlobalEvent).on('myEvent', function(e, gap){
                console.log(gap)
            })


            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            /// image change
            var _setBannerDesktopImage = function(){
                //console.log('pc image')
                $.each($('.js-change-img'), function(){
                    $(this).css({
                        backgroundImage: 'url('+ $(this).data('pc-image') +')'
                    })
                })
            }

            var _setBannerMobileImage = function(){
                //console.log('mobile image')
                $.each($('.js-change-img'), function(){
                    $(this).css({
                        backgroundImage: 'url('+ $(this).data('mobile-image') +')'
                    })
                })
            }

            var _onChangeDeviceSizeHandler = function() {
                if(window.GlobalVars.CurrentScreenType === window.GlobalVars.DeviceType.DESKTOP) {
                    _checkOpenedMobileGnb();


                    isMobileScreen = false;
                }else {
                    if(!isMobileScreen){

                        _addEvent_gnb_NonDeskTop();
                        isMobileScreen = true;
                    }
                }
            };




            var _addEvent_gnb_NonDeskTop = function() {
                toggleMobileGnb.on({
                    click : _onClickToggleMobileGnbHandler
                });


            }

            var _checkOpenedMobileGnb = function(){
                if(globalNavBox.hasClass('show')){
                    globalNavBox.removeClass('show').removeAttr('style');

                    SdpApp.utils.main.removeFixed();
                }

            }




        };

        var _uiMainFn = function (take) {
            console.log(take + '외부로 노출된 함수 uiMainFn');
        }

        return {
            init: _init,
            ui_main_fn: _uiMainFn
        }
    })(App);

    App.ui.main = UI;
});

