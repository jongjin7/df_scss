/*=========================================================== [ Document Common UI ] =======================================================================*/
(function (ns, $, undefined) {
    var Document = (function () {
        var docsTopTitleNav, docsTopThirdStickyMenu, btnToggleMobileLnb, lnbDocument, sideLnbNav, sideLnb, mainContainer, footer, etcSideArea, btnGotoTop;

        var scrollTop, scrollBottom;
        var fixedClassName ='fixed-top';

        var isMobileScreen = false;
        var isOpenedMobileLnb = false;
        var isOnloadedPage = false;
        var isDocsTopThirdStickyMenu = $('#el-docs-top-third-nav').length > 0;
        var isDocsLnbMenu = $('#el-sidebar-lnb-document').length > 0;
        var headH = 64;

        var _init = function(){
            var isDocumentPage = SdpApp.utils.main.checkPageType('sdp-ly-document');
            if(isDocumentPage){
                _setDomElements();
                _addEvent();
                _initLnbSubMenu();

                if($('#el-main-container').hasClass('has-toc')) SdpApp.ui.toc.init(); //TOC
                if(!$('#el-sdp-container').hasClass('common-docs')) SdpApp.top_nav.use_scroll_top_nav();
            }
        };

        var _setDomElements = function () {
            docsTopTitleNav = $('#el-top-title-nav');
            btnToggleMobileLnb = docsTopTitleNav.find('.btn-toggle-mobile-lnb');
            docsTopThirdStickyMenu = $('#el-docs-top-third-nav');
            lnbDocument = $('#el-sidebar-lnb-document');
            sideLnb = lnbDocument.find('.side-navbar');
            sideLnbNav = lnbDocument.find('.nav-lnb');
            mainContainer = $('#el-sdp-container');
            etcSideArea = mainContainer.find('.etc-aside');
            btnGotoTop = etcSideArea.find('.btn-goto-top');
            footer = $('.sdp-footer');


        };

        var _addEvent = function(){
            sideLnbNav.find('a').on('click', _onClicklnbMenu);
            btnToggleMobileLnb.on('click', _toggleMobileLnb);
            btnGotoTop.on('click', _onClickGotoTop);


            $(window.GlobalEvent).on(window.GlobalEvent.SCROLL, _onScroll);
            $(window.GlobalEvent).on(window.GlobalEvent.RESIZE, _onResize);
            $(window.GlobalEvent).on(window.GlobalEvent.CHANGE_DEVICE_SIZE, _onChangeDeviceSizeHandler);

            // 초기 로딩을 위해
            window.setTimeout(function(){
                _onScroll(undefined);
            },100);

        };


        var _onScroll = function($evt, $scroll){
            if(typeof $evt !== "undefined"){
                scrollTop = Math.ceil($scroll.top);
                scrollBottom = Math.ceil($scroll.bottom);
            }

            _stickyTopTitleNav($scroll);
            if($('.sdp-doc-nav-tabs').length > 0) _stickyDocNavTab($scroll); //skin, remote page's tab
            if(isDocsTopThirdStickyMenu) _stickyDocsTopThirdMenu($scroll);
            if(isDocsLnbMenu) _resizeLnbArea($scroll);
            _initPositionGotoTop();
        };

        var _onResize = function(){
            $(window).trigger(window.GlobalEvent.SCROLL);
            if ( isOpenedMobileLnb && window.GlobalVars.CurrentScreenType === window.GlobalVars.DeviceType.DESKTOP ) {
                _checkOpenedMobileLnb();
            }

            if(window.GlobalVars.CurrentScreenType === window.GlobalVars.DeviceType.DESKTOP){
                //if(isDocsLnbMenu) _leftPosLnbToDesktop();
            }
        };

        var _onChangeDeviceSizeHandler = function() {
            if(window.GlobalVars.CurrentScreenType === window.GlobalVars.DeviceType.DESKTOP) {
                isMobileScreen = false;
                _closeAllSubMenu();

            }else {
                if(!isMobileScreen){
                    isMobileScreen = true;
                    _closeAllSubMenu();
                }
            }

            isOnloadedPage = true;
        };

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// Event

        var _onClickGotoTop = function(e){
            window.setTimeout(function(){
                _onScroll(undefined, {top:0,bottom:0});
                if($('#el-main-container').hasClass('has-toc')) SdpApp.ui.toc.init_toc_top_pos();
            },30);
        };

        var _initPositionGotoTop = function(){
            if(scrollBottom - footer.offset().top > 0  && scrollBottom > footer.offset().top){
                var parentHeight = btnGotoTop.parent().parent().height() + 22;
                if(isDocsTopThirdStickyMenu){
                    btnGotoTop.css({
                        position : 'absolute',
                        top:"calc(2rem + " + ( parentHeight + headH) + "px)",
                    });
                }else{
                    btnGotoTop.css({
                        position : 'absolute',
                        top : "calc(2rem + " + parentHeight + "px)",
                    });
                }

            }else{
                btnGotoTop.css({
                    position: 'fixed',
                    top: 'auto',
                    bottom:'1rem'
                });
            }

            if(scrollTop > 100) {
                btnGotoTop.addClass('show');
            }else{
                btnGotoTop.removeClass('show');
            }

            if($('body').hasClass('fixed')) {
                btnGotoTop.removeClass('show');
            }
        };


        // sticky titleNav
        var _stickyTopTitleNav = function(e){
            //console.log('dddd',window.GlobalVars.getScrollTop,window.GlobalVars.getFixedScrollTop )
            if (window.GlobalVars.getScrollTop > headH || window.GlobalVars.getFixedScrollTop > headH) {
                if (!docsTopTitleNav.hasClass(fixedClassName)) {
                    docsTopTitleNav.addClass(fixedClassName);
                }
                docsTopTitleNav.css('top', 0);
            } else {
                if (docsTopTitleNav.hasClass(fixedClassName)) {
                    docsTopTitleNav.removeClass(fixedClassName);
                }
                docsTopTitleNav.css('top', headH);

                // skin download, Remote Test Lab
                if($('.title-nav-dropdown').length > 0 ){
                    if($('.title-nav-dropdown .dropdown').hasClass('show')){
                        $('.title-nav-dropdown .dropdown').click();
                    }
                }
            }

        };


        var _stickyDocsTopThirdMenu = function(e){
            if (window.GlobalVars.getScrollTop > headH || window.GlobalVars.getFixedScrollTop > headH) {
                if (!docsTopThirdStickyMenu.hasClass(fixedClassName)) {
                    docsTopThirdStickyMenu.addClass(fixedClassName);
                }
                docsTopThirdStickyMenu.css('top', headH);
            } else {
                if (docsTopThirdStickyMenu.hasClass(fixedClassName)) {
                    docsTopThirdStickyMenu.removeClass(fixedClassName);
                }
                docsTopThirdStickyMenu.css('top', headH * 2);
            }
        };



        //remote test lab, skin download
        var _stickyDocNavTab = function(e){
            //console.log('tab offset', $('.sdp-doc-nav-tabs').offset().top)
            var tabOffsetTop = $('.sdp-doc-nav-tabs').offset().top - 66;
            if (window.GlobalVars.getScrollTop > tabOffsetTop || window.GlobalVars.getFixedScrollTop > tabOffsetTop) {
                if(!$('.sdp-doc-nav-tabs').hasClass(fixedClassName)){
                    $('.sdp-doc-nav-tabs').addClass(fixedClassName);
                    //$('.sdp-doc-nav-tabs .nav-tabs').css('top', tabOffsetTop);
                }
            }else{
                if($('.sdp-doc-nav-tabs').hasClass(fixedClassName)){
                    $('.sdp-doc-nav-tabs').removeClass(fixedClassName);
                    //$('.sdp-doc-nav-tabs .nav-tabs').css('top', '');
                }
            }
        }



        // sticky lnbMenu
        var _resizeLnbArea = function($scroll){
            if (window.GlobalVars.getScrollTop > headH || window.GlobalVars.getFixedScrollTop > headH) {
                if (!sideLnb.hasClass(fixedClassName)) {
                    sideLnb.addClass(fixedClassName);
                    sideLnb.css('height', '');
                }
            } else {
                if (sideLnb.hasClass(fixedClassName)) {
                    sideLnb.removeClass(fixedClassName);
                }

                if(window.GlobalVars.getScrollTop > 0){
                    var scrollTop = Math.ceil($(window).scrollTop());
                    var newHeadH = (isDocsTopThirdStickyMenu && !isMobileScreen)? headH*3: headH*2;
                    sideLnb.css({
                        height: window.GlobalVars.WindowInfo.height - (newHeadH - scrollTop)
                    });
                }else{
                    sideLnb.css('height', '');
                }
            }


            if(window.GlobalVars.CurrentScreenType === window.GlobalVars.DeviceType.DESKTOP) {
                if(scrollBottom - footer.offset().top > 0 && scrollBottom > footer.offset().top){
                    sideLnb.css({
                        bottom: scrollBottom - Math.ceil(footer.offset().top)
                    });
                }else{
                    sideLnb.css({
                        bottom:  0
                    });
                }
            }else {
                sideLnb.css({
                    bottom:  0
                });
            }



        };

        _leftPosLnbToDesktop = function(){
            var getPosLeft = lnbDocument.offset().left;
            if(getPosLeft > 0){
                sideLnb.css('left', getPosLeft);
            }else{
                sideLnb.css('left', '');
            }
        }


        _initLnbSubMenu = function(){
            //console.log('_initLnbSubMenu', isOnloadedPage)
            $.each(sideLnbNav.find('li'), function(){
                // 자식그룹이 없으면 none-child 클래스 추가
                if(!$(this).find('ul').length  > 0 && !$(this).find('> a').hasClass('depth4-link')){
                    $(this).find('>a').addClass('none-child');
                }

                // 메뉴 활성화
                if($(this).find('ul').length > 0 && $(this).find('>a').hasClass('active')){
                    $(this).find('> a').addClass('show').next('.navbar-sub-wrap').css('height', 'auto');
                }
            });
        };


        // LNB Click Handler
        var _onClicklnbMenu = function(e){
            if(!$(this).hasClass('none-child') && !$(this).hasClass('depth4-link')){
                e.preventDefault();
                if(!$(this).parent().hasClass('lnb-depth1')){
                    $(this).parents('.navbar-sub-wrap').css('height','auto');
                }

                if(!$(this).hasClass('show')){
                    $(this).addClass('show');
                    var addSpace;
                    if(!isMobileScreen){
                        addSpace = $(this).parent().hasClass('lnb-depth1')? 32 : 0;
                    }else{
                        addSpace = $(this).closest('ul').hasClass('lnb-depth2')? 44 : 0
                    }

                    var h = $(this).parent().find('.navbar-sub-wrap > ul').height() + addSpace;
                    $(this).next('.navbar-sub-wrap').stop().animate({
                        height: h
                    },300);
                }else{
                    $(this).parent().find('.navbar-sub-wrap').stop().animate({
                        height: 0
                    },200, function(){
                        $(this).siblings().removeClass('show');
                    });

                }
            }
        };


        var _toggleMobileLnb = function(e){
            e.preventDefault();
            if(!lnbDocument.hasClass('show')){
                lnbDocument.find('.side-navbar').off("animationend webkitAnimationEnd oAnimationEnd oAnimationEnd MSAnimationEnd");
                lnbDocument.addClass('show');
                btnToggleMobileLnb.addClass('active');

                isOpenedMobileLnb = true;

                SdpApp.utils.main.setFixed(window.GlobalVars.fixedType.SUBNAV);
            }else{

                lnbDocument.find('.side-navbar').one("animationend webkitAnimationEnd oAnimationEnd oAnimationEnd MSAnimationEnd", function(){
                    lnbDocument.find('.side-navbar').off("animationend webkitAnimationEnd oAnimationEnd oAnimationEnd MSAnimationEnd");
                    lnbDocument.find('.side-navbar').scrollTop(0);
                    lnbDocument.removeClass('show').removeClass('hide');
                });

                lnbDocument.addClass('hide');
                btnToggleMobileLnb.removeClass('active');

                isOpenedMobileLnb = false;

                SdpApp.utils.main.removeFixed();
            }
        };

        var _closeAllSubMenu = function(){
            //console.log('changeLnb', isOnloadedPage)
            if(isOnloadedPage){
                $.each(sideLnbNav.find('li'), function(){
                    $(this).find('a').removeClass('show active');
                    $(this).find('.navbar-sub-wrap').removeAttr('style');
                });
            }

        };

        var _checkOpenedMobileLnb = function(){
            if(isOpenedMobileLnb){
                btnToggleMobileLnb.click();
            }
        };


        return {
            init: _init,
            is_opened_mobile_lnb : _checkOpenedMobileLnb
        }

    })();

    ns.ui.document = Document;

}(SdpApp || {}, jQuery));
