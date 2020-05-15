/*=========================================================== [ Header / Etc. Nav ] =======================================================================*/
(function (ns, $, undefined) {
    var TopNav = (function () {
        var body, header, globalNavBar, headerOuterBg, btnToggleGlobalSearch, modalGlobalSearch;
        var scrollTop = 0;
        var isMobileScreen = false;
        var _init = function(){
            _setDomElements();
            _addEvent();
        };

        var _setDomElements = function () {
            body = $('body');
            header = $('#el-sdp-header');

            btnToggleGlobalSearch = header.find('.btn-global-search');
            header.find('.btn-global-search.is-mobile').css('position', 'absolute');

            modalGlobalSearch = $('#modal-global-top-search');

            globalNavBar = header.find('.navbar-wrap');
            headerOuterBg = header.find('.bg-header-block');
        };

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// Event

        var _addEvent = function(){

            btnToggleGlobalSearch.on({
                click: _onClickToggleGlobalSearch
            });
            modalGlobalSearch.find('.btn-close-modal').on({
                click: _onClickToggleGlobalSearch
            });

            $(window.GlobalEvent).on(window.GlobalEvent.SCROLL, _onScrollHandler);
            $(window.GlobalEvent).on(window.GlobalEvent.RESIZE, _onResizeHandler);
            $(window.GlobalEvent).on(window.GlobalEvent.CHANGE_DEVICE_SIZE, _onChangeDeviceSizeHandler);

        };


        var _useScrollTopNav = function(){
            //console.log('외부에서 top-nav.js 함수 호출')
            header.find('nav').removeClass('fixed-top');
        };

        var _onChangeDeviceSizeHandler = function() {
            if(window.GlobalVars.CurrentScreenType === window.GlobalVars.DeviceType.DESKTOP) {
                isMobileScreen = false;
            }else {

                if(!isMobileScreen){
                    isMobileScreen = true;
                }
            }
        }


        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// Event handler

        var _onScrollHandler = function(e, $scroll){
            scrollTop = $scroll.top;
        };

        var _onResizeHandler = function(){

        };

        var _onClickToggleGlobalSearch = function(e){
            e.preventDefault();

            if(!modalGlobalSearch.hasClass('show')){
                $(this).focus();
                  
                if($('#toggle-mobile-gnb').hasClass('active')){
                    $('#toggle-mobile-gnb').click();
                }
                modalGlobalSearch.off("animationend webkitAnimationEnd oAnimationEnd oAnimationEnd MSAnimationEnd");
                modalGlobalSearch.one("animationend webkitAnimationEnd oAnimationEnd oAnimationEnd MSAnimationEnd", function(){
                    modalGlobalSearch.off("animationend webkitAnimationEnd oAnimationEnd oAnimationEnd MSAnimationEnd");
                    modalGlobalSearch.find('input').focus();

                });
                if(SdpApp.utils.main.checkPageType('sdp-ly-document')) SdpApp.ui.document.is_opened_mobile_lnb();

                SdpApp.ui.main.check_current_active_modal(modalGlobalSearch);
                header.css('z-index', 'auto');
                // header.find('.gnb .depth1-link').off("animationend webkitAnimationEnd oAnimationEnd oAnimationEnd MSAnimationEnd");
                header.find('.gnb').addClass('hide');

                modalGlobalSearch.addClass('show');
                SdpApp.ui.main.show_backdrop($(this), null, 'fluid');
                //SdpApp.ui.main.show_backdrop($(this));

                SdpApp.search.top_global_search.shown_modal();
                btnToggleGlobalSearch.addClass('active');
            }else{
                modalGlobalSearch.one("animationend webkitAnimationEnd oAnimationEnd oAnimationEnd MSAnimationEnd", function(){
                    modalGlobalSearch.off("animationend webkitAnimationEnd oAnimationEnd oAnimationEnd MSAnimationEnd");
                    modalGlobalSearch.find('.inner-scroll').scrollTop(0);
                    modalGlobalSearch.removeClass('show hide');
                    header.css('z-index', '');
                    header.find('.gnb').removeClass('hide');
                });


                // header.find('.gnb .depth1-link').one("animationend webkitAnimationEnd oAnimationEnd oAnimationEnd MSAnimationEnd", function(){
                //     header.find('.gnb .depth1-link').off("animationend webkitAnimationEnd oAnimationEnd oAnimationEnd MSAnimationEnd");
                //     header.find('.gnb').removeClass('show hide');
                // });
                // header.find('.gnb').addClass('show');

                modalGlobalSearch.addClass('hide');
                SdpApp.ui.main.hide_backdrop();

                SdpApp.search.top_global_search.close_search_modal();
                btnToggleGlobalSearch.removeClass('active');
            }
        };

        var _isOpendedModalGlobalSearch = function(){
            if(modalGlobalSearch.hasClass('show')) {
                modalGlobalSearch.removeClass('show');
                btnToggleGlobalSearch.removeClass('active');
                SdpApp.ui.main.hide_backdrop();
            }
        };

        return {
            init: _init,
            use_scroll_top_nav : _useScrollTopNav
        }

    })();

    ns.top_nav = TopNav;

}(SdpApp || {}, jQuery));
