/*=========================================================== [ Document TOC ] =======================================================================*/
(function (ns, $, undefined) {
    var Toc = (function () {
        var scrollTop, scrollBottom, newScrollTop;
        var etcSideArea, mainContainer, tocHeadingItems, mainContainer, sideTocMenu, footer;
        var defaultPositionToc;
        var arrHeadingTagPosition =[];
        var gapScrollTop, gapHead;
        var tocHeight;
        var accordionList;
        var fixedClassName = 'fixed-top';
        var isDocsTopThirdStickyMenu = $('#el-docs-top-third-nav').length > 0;
        var isLeadingDocPage = $('.sdp-ly-leadings').length > 0;
        var headH = 64;



        var _init = function () {
            _setDomElements();
            _createTocMenu();

        };

        var _setDomElements = function () {
            mainContainer = $('#el-main-container');
            etcSideArea = mainContainer.find('.etc-aside');
            tocHeadingItems = mainContainer.find('.inner-sec h1,h2');
            accordionList = $('.sdp-doc-accordion');
            footer = $('.sdp-footer');
        };



        var _createTocMenu = function () {
            var tocMenu = $('<div id="toc-menu" class="side-toc" />');
            var menuItems =[];

            $.each(tocHeadingItems, function (){
                var thisText = $(this).text();
                //var replacePattern = /[\{\}\[\]\/?.,;:|\)*~`!^+<>@\#$%&\\\=\(\'\"]/gi;
                //var headingTagId= 'toc-'+ thisText.replace(/\s/g, '-').replace(replacePattern ,'').trim();
                var headingTagId = $(this).attr('id');
                menuItems.push('<li class="toc-list-item"><a href="#'+ headingTagId +'" class="toc-link">'+ thisText +'</a></li>');
            });

            var ulTag = '<ol class="toc-list">'+ menuItems.join('') +'</ol>';
            var navTag ='<nav class="toc"><div class="inner-toc">'+ ulTag +'</div></nav>';

            tocMenu.html(navTag);
            tocMenu.prependTo(etcSideArea);

            sideTocMenu = etcSideArea.find('.side-toc');
            defaultPositionToc = sideTocMenu.position().top;
            tocHeight = sideTocMenu.height();
            _addEvent();
        };

        var _addEvent = function () {
            //$(window.GlobalEvent).on(window.GlobalEvent.MOUSE_WHEEL, _onMouseWheel);
            $(window.GlobalEvent).on(window.GlobalEvent.SCROLL, _onScroll);
            $(window.GlobalEvent).on(window.GlobalEvent.RESIZE, _onResize);

            sideTocMenu.find('.toc-link').on({
                click: _onClickTocMenuHandler
            })

            if(accordionList.length > 0){
                $('.sdp-doc-accordion').on('shown.bs.collapse hidden.bs.collapse', function () {
                    _saveHeadingTagPosition();
                })
            }

            setTimeout(function(){
                _saveHeadingTagPosition();
                _onScroll(undefined);

            },100);

        };


        var _onScroll = function ($evt, $scroll) {
            if ( window.GlobalVars.CurrentScreenType === window.GlobalVars.DeviceType.DESKTOP ){
                if(typeof $evt !== "undefined") {
                    scrollTop = Math.ceil($scroll.top);
                    scrollBottom = Math.ceil($scroll.bottom);
                }

                _correctNewScrollTop();
                _bottomPositionToc();
                _topPositionToc();
                _activeTocMenu();
            }
        };

        var _onResize = function () {
            if ( window.GlobalVars.CurrentScreenType === window.GlobalVars.DeviceType.DESKTOP ) {
                if(mainContainer.closest('.common-docs').length > 0){
                    _setLeftPosToc();
                }
                _saveHeadingTagPosition();
            }
        };


        ///////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// Event Handler

        // 현재 스크롤 위치에 있는 해딩 태그 찾기
        var _correctNewScrollTop = function(){
            if(sideTocMenu.hasClass(fixedClassName)){
                gapScrollTop = headH*2;
            }else{
                gapScrollTop = headH
            }

            if(isDocsTopThirdStickyMenu) {
                gapScrollTop += headH;
            }

            newScrollTop = Number(scrollTop) + gapScrollTop;
        }

        var _saveHeadingTagPosition = function(){
            // console.log('before Heading Position', tocHeadingItems, arrHeadingTagPosition)
            arrHeadingTagPosition = [];
            $.each(tocHeadingItems, function (){
                arrHeadingTagPosition.push(Math.ceil($(this).offset().top));
            });

            //console.log('_saveHeadingTagPosition', arrHeadingTagPosition);
        }
        
        var _activeTocMenu = function($parm){
            sideTocMenu.find('.toc-link').removeClass('is-active-link');
            //console.log('_activeTocMenu' , arrHeadingTagPosition)
            var arrLength = arrHeadingTagPosition.length;
            for(var i=0, leng = arrHeadingTagPosition.length; i < leng; i++){
                if(newScrollTop < arrHeadingTagPosition[1]) {
                    //console.log('first')
                    sideTocMenu.find('li').eq(0).find('.toc-link').addClass('is-active-link');
                }else if(newScrollTop >= arrHeadingTagPosition[i]  && newScrollTop < arrHeadingTagPosition[i+1]){
                    //console.log('etc')
                    sideTocMenu.find('li').eq(i).find('.toc-link').addClass('is-active-link');
                }else if(newScrollTop >= arrHeadingTagPosition[i] && newScrollTop >= arrHeadingTagPosition[arrLength - 1] ){
                    //console.log('last')
                    sideTocMenu.find('li').eq(arrLength - 1).find('.toc-link').addClass('is-active-link');
                }
            }
        };

        var _topPositionToc = function(){
            if (scrollTop > headH) {
                if (!sideTocMenu.hasClass(fixedClassName)) {
                    sideTocMenu.addClass(fixedClassName);
                }
            } else {
                if (sideTocMenu.hasClass(fixedClassName)) {
                    sideTocMenu.removeClass(fixedClassName);
                }
            }
        };

        var _setLeftPosToc = function(){
            if(sideTocMenu.is(':visible')) {
                var getPosLeft;
                getPosLeft = etcSideArea.offset().left;
                sideTocMenu.css('left', getPosLeft);
            }
        };

        var _bottomPositionToc = function(){

            if(scrollBottom - footer.offset().top > 0 && scrollBottom > footer.offset().top){
                sideTocMenu.css({
                    bottom:  Math.ceil(scrollBottom - footer.offset().top)
                });
            }else{
                sideTocMenu.css('bottom', 0);
            }
        };

        _onClickTocMenuHandler = function(e){
            e.preventDefault();
            var idx = $(this).parent().index();
            var tmpScrolltop = 64;
            $('html, body').animate({scrollTop: arrHeadingTagPosition[idx]-(tmpScrolltop-0.5)}, 300);
            window.history.pushState('', '',  $(this).attr('href'));
        }


        return {
            init: _init,
            init_toc_top_pos : _topPositionToc,
            set_toc_headpos: _saveHeadingTagPosition
        }

    })();

    ns.ui.toc = Toc;

}(SdpApp || {}, jQuery));