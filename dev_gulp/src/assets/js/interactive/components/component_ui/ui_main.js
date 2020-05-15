/*=========================================================== [ Component UI Main ] =======================================================================*/
(function (ns, $, undefined) {
    var UiComponentMain = (function () {
        var motionElList, commonBackdrop;
        var modalTriggerEl, targetModalEl;
        var btnDocCta, btnDownloadGauge;

        var useBodyScroll;

        var _init = function () {
            SdpApp.ui.document.init();
            _setDomElements();
            _addEvent();
            _onChangeDeviceSizeHandler();

        };

        var _setDomElements = function () {
            motionElList = $('.js-motion');
            modalTriggerEl = $("[data-toggle ='s-modal']");

            // 도큐먼트 컴포넌트
            btnDocCta = $('.btn-doc-cta');
            btnDownloadGauge = $('.btn-doc-cta.gauge-download');
        };

        var _addEvent = function () {
            modalTriggerEl.on('click', _showCommonModal); //페이지에서 사용하는 모든 모달 트리거용 대상에 이벤트 붙이기

            $(window.GlobalEvent).on(window.GlobalEvent.SCROLL, _onScroll);
            $(window.GlobalEvent).on(window.GlobalEvent.RESIZE, _onResize);
            $(window.GlobalEvent).on(window.GlobalEvent.CHANGE_DEVICE_SIZE, _onChangeDeviceSizeHandler);

            if(btnDocCta.length > 0){
                $('[data-toggle="tooltip"]').tooltip();
            }
        };

        var _onScroll = function ($evt, $scroll) {

        };


        var _onResize = function(e, win) {
            if (btnDownloadGauge.length > 0) _resizeDocCtaDownloadTextWidth();

            if(window.GlobalVars.CurrentScreenType == window.GlobalVars.DeviceType.DESKTOP) {
                $('.btn-doc-cta').each(function(){
                    var innerBtnWidth = $(this).find('.btn').width();
                    var rightTxtWidth = $(this).find('> .btn > .rgt-txt').length > 0 ? $(this).find('> .btn > .rgt-txt > .txt-info').outerWidth() : 0;
                    var btnTotalTextWidth = ($(this).find('.btn > .lft-txt > .txt').outerWidth() +  rightTxtWidth) * 1.01;
                    if(innerBtnWidth - btnTotalTextWidth > 0 ) {
                        $(this).find('[data-toggle="tooltip"]').tooltip('disable');
                    }else{
                        $(this).find('[data-toggle="tooltip"]').tooltip('enable');
                    }
                });
            }else {
                $('.btn-doc-cta').find('[data-toggle="tooltip"]').tooltip('disable');
            }
        }


        var _onChangeDeviceSizeHandler = function() {
            if(window.GlobalVars.CurrentScreenType !== window.GlobalVars.DeviceType.MOBILE) {
                _setBannerDesktopImage();
            }else {
                _setBannerMobileImage();
            }
        };

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// Event


        var _setElementFocus = function (elem, scrollBottom) {
            var ty = Detectizr.device === window.GlobalVars.DeviceType.MOBILE ? elem.offset().top : elem.offset().top + elem.height() * 0.2;
            if (scrollBottom > ty) {
                if (scrollBottom - window.innerHeight > elem.offset().top + elem.height()) {
                    if (elem.hasClass('onTrans')) {
                        console.log('has conTrans')
                    }
                } else {
                    if (!elem.hasClass('onTrans')) {
                        elem.addClass('onTrans');
                        console.log(elem)
                    }
                }
            }
            if (scrollBottom < elem.offset().top) {
                if (elem.hasClass('onTrans')) {
                    elem.removeClass('onTrans');
                }
            }

        };


        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// Modal Component
        var _checkCurrentActiveModal = function($modal){
            if($('.common-modal').hasClass('show')){
                $('.common-modal').not($modal).removeClass('show');
                // 통합 검색 페이지에서 페이지 모달이 활성화 된 경우?
                if($('.common-modal').is('#modal-search-main')){
                    SdpApp.search.main.close_search_modal();
                }
                commonBackdrop.off('click').remove();
            }
        };


        var _showCommonModal = function(e,$el, $bodyScroll, $backdropType){
            if(typeof e !== 'string' && typeof e === 'object'){
                e.preventDefault();
                var self = $(this);
                targetModalEl = $(self.attr('data-target'));
            }else{
                targetModalEl = $(e);
            }

            // 모달내 Close버튼
            targetModalEl.addClass('show').find('.btn-close-modal').click(function(){
                _hideCommonModal();
                _removeCommonBackDrop();
            });

            _createCommonBackDrop(_hideCommonModal, $bodyScroll, $backdropType);
        };

        var _hideCommonModal = function(){
            targetModalEl.on("animationend webkitAnimationEnd oAnimationEnd oAnimationEnd MSAnimationEnd",
                function() {
                    targetModalEl.off("animationend webkitAnimationEnd oAnimationEnd oAnimationEnd MSAnimationEnd");
                    targetModalEl.removeClass('show hide');
                    targetModalEl.find('.btn-close-modal').off('click');
                }
            );
            targetModalEl.addClass('hide');
        };


        var _hideSdpModal = function($targetModal){
            console.log('targetModalEl', targetModalEl)
            targetModalEl = $targetModal === undefined? targetModalEl : $($targetModal);
            _hideCommonModal();
            _removeCommonBackDrop();
        }

        var _createCommonBackDrop = function($el, $bodyScroll, $backdropType){
            //console.log('_createCommonBackDrop')

            commonBackdrop = $('<div class="common-backdrop" />');
            useBodyScroll = ($bodyScroll === undefined || $bodyScroll === null) ? false : $bodyScroll;
            if($backdropType === 'fluid') commonBackdrop.addClass('full-backdrop');
            if(!useBodyScroll){
                SdpApp.utils.main.setFixed();
            }

            $('body').append(commonBackdrop);
            commonBackdrop.off("animationend webkitAnimationEnd oAnimationEnd oAnimationEnd MSAnimationEnd");
            commonBackdrop.addClass('show').one('click', {targetEl:$el},_clickDropdownHandler);
        };

        var _clickDropdownHandler = function(e){
            if(typeof e.data.targetEl === "function"){
                // 트리거 대상이 없다면?
                _removeCommonBackDrop();
                e.data.targetEl();
            }else{
                e.data.targetEl.trigger('click');
            }
        };

        var _removeCommonBackDrop = function(){
            commonBackdrop.on("animationend webkitAnimationEnd oAnimationEnd oAnimationEnd MSAnimationEnd",
                function() {
                    commonBackdrop.off("animationend webkitAnimationEnd oAnimationEnd oAnimationEnd MSAnimationEnd");
                    commonBackdrop.remove();
                }
            );

            commonBackdrop.addClass('hide');

            if(!useBodyScroll){
                SdpApp.utils.main.removeFixed();
                useBodyScroll = true;
            }
        };


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


        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// Clipboard
        var _copyToClipboard = function(copyText){
            /* Select the text field */
            copyText.select();

            /* Copy the text inside the text field */
            document.execCommand("copy");
        };

        var _iosCopyToClipboard = function(el) {
            var oldContentEditable = el.contentEditable,
                oldReadOnly = el.readOnly,
                range = document.createRange();

            el.contentEditable = true;
            el.readOnly = false;
            range.selectNodeContents(el);

            var s = window.getSelection();
            s.removeAllRanges();
            s.addRange(range);

            el.setSelectionRange(0, 999999); // A big number, to cover anything that could be inside the element.

            el.contentEditable = oldContentEditable;
            el.readOnly = oldReadOnly;

            document.execCommand('copy');
        };






        // CTA 다운로드 버튼 내용 세팅
        var _setDownloadGaugeMaskText = function(){
            $.each(btnDownloadGauge, function(index, item){
                var orgBtn = $(this).find('> .btn');
                var maskBtn = $(this).find('.mask-bar > .btn');
                var btnTitleText = orgBtn.find('.lft-txt > .txt').text();
                var btnDataSizeText = orgBtn.find('.rgt-txt .line + em').text();

                maskBtn.find('.lft-txt > .txt').text(btnTitleText);
                maskBtn.find('.rgt-txt .line + em').text(btnDataSizeText);
            })
        }

        // CTA 다운로드 버튼 내 텍스트 width값 설정
        var _checkDocCtaTextWidth = function($el){
            var innerBtnWidth = $el.find('.btn').width();
            var rightTxtWidth = $el.find('> .btn > .rgt-txt').length > 0 ? $el.find('> .btn > .rgt-txt > .txt-info').outerWidth() : 0;
            //console.log('rightTxtWidth',$el.find('.btn').width(), $el.find('.btn > .lft-txt').outerWidth(), $el.find('.btn > .rgt-txt').outerWidth() )
            console.log('rgtWidth',$el, innerBtnWidth, $el.find('.btn > .lft-txt').outerWidth(),  rightTxtWidth );
            var btnTextWidth = $el.find('.btn > .lft-txt').outerWidth() +  rightTxtWidth;
            if(btnTextWidth > innerBtnWidth) return true
            else return false;
        }

        // CTA 다운로드 버튼 마스크 영역 크기 세팅
        var _setDownloadGaugeWidth = function(){
            $.each(btnDownloadGauge, function(index, item){
                var btnWidth = $(this).width();
                var innerBtnWidth = $(this).find('.btn').width();
                var rightTxtWidth = $(this).find('> .btn > .rgt-txt > .txt-info').outerWidth();
                var btnTextTotalWidth = $(this).find('.btn > .lft-txt').outerWidth() +  rightTxtWidth;
                $(this).find('.mask-bar > .btn').css('width', btnWidth);
            })
        };

        // CTA 다운로드 버튼 말줄임 영역
        var _resizeDocCtaDownloadTextWidth = function(){
            btnDownloadGauge.each(function() {
                var innerBtnWidth = $(this).find('.btn').width();
                var rightTxtWidth = $(this).find('> .btn > .rgt-txt > .txt-info').outerWidth();
                $(this).find('.btn > .lft-txt').css('max-width', innerBtnWidth - rightTxtWidth);
            });
        };





        return {
            init: _init,
            show_modal: _showCommonModal,
            hide_modal: _hideSdpModal,
            show_backdrop: _createCommonBackDrop,
            hide_backdrop: _removeCommonBackDrop,
            check_current_active_modal : _checkCurrentActiveModal,
            copy_clipboard: _copyToClipboard,
            copy_ios_clipboard: _iosCopyToClipboard
        };

    })();

    ns.ui.main = UiComponentMain;

}(window.SdpApp || {}, jQuery));
