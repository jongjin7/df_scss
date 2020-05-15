/*========================================== [ Search page Module ] ==========================================*/
(function (ns, $, undefined) {
    var SearchMain = (function () {
        var mainSearchModalWrap, modalSearchMain, mainSearchForm, searchInputField, searchResultList;
        var _init = function(){
            var currentSearchPage = SdpApp.utils.main.checkPageType('sdp-ly-search');
            if(currentSearchPage){
                //console.log('Search Main 컴포넌트 Init!')
                _setDomElements();
                _addEvent();
            }

            ns.search.top_global_search.init();
        }

        var _setDomElements = function () {
            mainSearchModalWrap = $('#el-main-search-form-wrap');
            modalSearchMain = $('#modal-search-main');
            mainSearchForm = $('#main-sdp-search-form');
            searchInputField = $('#main-sdp-form-search-field');
            searchResultList = modalSearchMain.find('.inner-result-sec');
        };

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// Event
        var _addEvent = function(){
            searchInputField.on({
                focusin: _onFocusInSearchFieldHandler
            });

            mainSearchForm.on({
                submit: _onSubmitSearchHandler
            })

        }

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// Event Handler
        var _onFocusInSearchFieldHandler = function(){
            if(mainSearchModalWrap.hasClass('static')){
                mainSearchModalWrap.removeClass('static');
                modalSearchMain.addClass('show');
                searchInputField.focus();
                SdpApp.ui.main.show_backdrop(_closeSearchModal);
                _completeShownSearchModal();
            }
        }

        var _onSubmitSearchHandler = function(e){
            e.preventDefault();

            // todo submit logic 처리 후 호출!
            _onCompletedSubmit();
        }

        var _onCompletedSubmit = function(){
            _closeSearchModal();
            SdpApp.ui.main.hide_backdrop();
            searchInputField.blur();
            console.log('검색 페이지에서 Submit 완료')
        }

        var _completeShownSearchModal = function(){
            console.log('검색 페이지에서 검색 모달이 열렸을 때 로직 실행')
        }

        var _closeSearchModal = function(){
            console.log('검색 페이지에서 검색 모달이 닫힐 때')
            mainSearchModalWrap.addClass('static');
            modalSearchMain.removeClass('show');
            _initSearchFormData();
        }

        var _initSearchFormData = function(){
            //searchResultList.empty();
        }

        return {
            init: _init,
            close_search_modal: _closeSearchModal,
        }

    })();

    ns.search.main = SearchMain;

}(SdpApp || {}, jQuery));