/*=========================================================== [ Gnb ] =======================================================================*/
(function(ns, $, undefined){
    var GlobalNavigation = (function () {
        var globalNavBox, navGnb, global_common_1Depth,  gnb_2Depth,
            global_common_nav, global_common_1Depth_mobileToggle, global_common_1DepthLinkItem, global_common_2Depth, commonOhtersMenu;
        var toggleMobileGnb;
        var isMobileScreen = false;
        var isOpened2depth = false;

        var _init = function () {
            _setDomElements();
            _check1DepthSubMenu();
            _onChangeDeviceSizeHandler();

            $(window.GlobalEvent).on(window.GlobalEvent.RESIZE, _onResizeHandler);
            $(window.GlobalEvent).on(window.GlobalEvent.CHANGE_DEVICE_SIZE, _onChangeDeviceSizeHandler);
        };

        var _setDomElements = function () {
            globalNavBox = $('#global-nav-collapse');
            navGnb = globalNavBox.find('.gnb');
            gnb_2Depth = navGnb.find('.navbar-depth2-wrap');

            global_common_nav = globalNavBox.find('.main-nav');
            global_common_1Depth = globalNavBox.find('.navbar-depth1');
            global_common_1Depth_mobileToggle = global_common_1Depth.find('> .nav-item > .toggle-submenu');
            global_common_1DepthLinkItem = globalNavBox.find('.depth1-link');
            global_common_2Depth = globalNavBox.find('.navbar-depth2-wrap');
            commonOhtersMenu = global_common_1Depth.find('> .nav-item').children().not('.depth1-link, .navbar-depth2-wrap');
            toggleMobileGnb = $('#toggle-mobile-gnb');
        };

        var _onResizeHandler = function(e, parm){

        }

        var _onChangeDeviceSizeHandler = function() {
            if(window.GlobalVars.CurrentScreenType === window.GlobalVars.DeviceType.DESKTOP) {
                _checkOpenedMobileGnb();

                _removeEvent_gnb_NonDeskTop();
                _addEvent_gnb_DeskTop();
                _init_2depthPosition_desktop();
                isMobileScreen = false;
            }else {
                if(!isMobileScreen){
                    _removeEvent_gnb_NonDeskTop();
                    _removeEvent_gnb_DeskTop();
                    _addEvent_gnb_NonDeskTop();
                    _init_2depthPosition_mobile();
                    isMobileScreen = true;
                }
            }
        };

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// Event

        var _addEvent_gnb_DeskTop = function() {
            global_common_nav.on({
                mouseleave: _onMouseOutGnbHandler
            });

            commonOhtersMenu.on({
                mouseover: _onMouseOver_2DepthHandler,
            });

            global_common_1DepthLinkItem.on({
                click: _onClick_1DepthLinkItemHandler,
                mouseover: _onMouseOver_1DepthLinkItemHandler,
            });

            global_common_1DepthLinkItem.next('.navbar-depth2-wrap').on({
                mouseleave: _onMouseOut_2DepthHandler
            });
        };

        var _addEvent_gnb_NonDeskTop = function() {
            toggleMobileGnb.on({
                click : _onClickToggleMobileGnbHandler
            });

            global_common_1Depth_mobileToggle.on({
                click: _onClick_1DepthLinkItemHandler
            });
        }

        var _removeEvent_gnb_DeskTop = function() {
            global_common_nav.off('mouseleave');
            global_common_1DepthLinkItem.off('click');
            global_common_1DepthLinkItem.off('mouseover');
            global_common_1DepthLinkItem.next('.navbar-depth2-wrap').off('mouseleave');
            commonOhtersMenu.off('mouseover');
        };

        var _removeEvent_gnb_NonDeskTop = function() {
            toggleMobileGnb.off('click');
            global_common_1Depth_mobileToggle.off('click');

        };

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// Event Handler


        var _onClickToggleMobileGnbHandler = function(){
            if(!globalNavBox.hasClass('show')){
                if($('.btn-global-search.is-mobile').hasClass('active')){
                    $('.btn-global-search.is-mobile').click();
                }
                if(SdpApp.utils.main.checkPageType('sdp-ly-document')) SdpApp.ui.document.is_opened_mobile_lnb();

                $(this).attr('aria-expanded', true).addClass('active');


                globalNavBox.on("animationend webkitAnimationEnd oAnimationEnd oAnimationEnd MSAnimationEnd", function(){
                    $(this).css('overflow-y', 'auto').off("animationend webkitAnimationEnd oAnimationEnd oAnimationEnd MSAnimationEnd");
                });
                globalNavBox.addClass('show');

                SdpApp.utils.main.setFixed();
            }else{
                globalNavBox.on("animationend webkitAnimationEnd oAnimationEnd oAnimationEnd MSAnimationEnd", function(){
                    $(this).off("animationend webkitAnimationEnd oAnimationEnd oAnimationEnd MSAnimationEnd");
                    $('#global-nav-collapse').scrollTop(0);
                    $(this).removeClass('show').removeClass('hide').removeAttr('style');
                });
                globalNavBox.addClass('hide');
                $(this).attr('aria-expanded', false).removeClass('active');
                _checkOpendedMobile2DepthMenu();

                SdpApp.utils.main.removeFixed();
            };
        }


        var _onMouseOutGnbHandler = function () {
            global_common_nav.find('.depth1-link').removeClass('show');
        }

        var _onClick_1DepthLinkItemHandler = function(e){
            if(isMobileScreen){
                global_common_nav.find('.toggle-submenu').not($(this))
                    .removeClass('show')
                    .parent().children('.navbar-depth2-wrap').stop().animate({
                    height: 0
                },200);

                if(!$(this).hasClass('show')){
                    $(this).addClass('show');
                    isOpened2depth = true;

                    var h = $(this).parent().find('.navbar-depth2-wrap ul').height() + 46;
                    $(this).parent().children('.navbar-depth2-wrap').stop().animate({
                        height: h
                    },300);
                }else{
                    $(this).removeClass('show');
                    isOpened2depth = false;

                    $(this).parent().children('.navbar-depth2-wrap').stop().animate({
                        height: 0
                    },200);
                };
            }

        };

        var _onMouseOver_1DepthLinkItemHandler = function () {
            global_common_nav.find('.depth1-link').removeClass('show');
            $(this).addClass('show')
        };


        var _onMouseOut_2DepthHandler = function () {
            $(this).parent().find('.depth1-link').removeClass('show');
        };

        var _onMouseOver_2DepthHandler = function () {
            if(global_common_1DepthLinkItem.hasClass('show')){
                global_common_1DepthLinkItem.each(function(){
                    $(this).removeClass('show');
                });
            }
        };

        var _checkOpenedMobileGnb = function(){
            if(globalNavBox.hasClass('show')){
                globalNavBox.removeClass('show').removeAttr('style');
                toggleMobileGnb.removeClass('active');

                SdpApp.utils.main.removeFixed();
            }

            _checkOpendedMobile2DepthMenu();
        }

        var _checkOpendedMobile2DepthMenu = function(){
            if(global_common_1Depth_mobileToggle.hasClass('show')){
                global_common_1Depth_mobileToggle.removeClass('show');
                global_common_1Depth_mobileToggle.parent().find('.navbar-depth2-wrap').removeAttr('style');
            }
        };

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// initial Style

        var _check1DepthSubMenu = function(){
            global_common_1DepthLinkItem.each(function(){
                if(!$(this).parent().find('ul').length  > 0){
                    $(this).prev().addClass('none-child');
                }
            });
        };

        var _init_2depthPosition_desktop = function(){
            global_common_2Depth.each(function(){
                $(this).css({
                    top: -1 * ($(this).innerHeight() + 20),
                })
            });
        };

        var _init_2depthPosition_mobile = function(){
            global_common_2Depth.each(function(){
                $(this).removeAttr('style');
            });
        };

        return {
            init: _init
        }

    })();

    ns.gnb = GlobalNavigation;

}(SdpApp || {}, jQuery));
