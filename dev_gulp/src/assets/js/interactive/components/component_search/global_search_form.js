/*=========================================================== [ header / Global Search ] =======================================================================*/
(function (ns, $, undefined) {
    var TopGlobalSearch = (function () {
        var modalSearchGlobal, globalSearchForm, searchInputField, searchResultList;
        var _init = function(){
            //console.log('Global Search Form init!')
            _setDomElements();
            _addEvent();

            // _initSearchFormData();
        };

        var _setDomElements = function () {
            modalSearchGlobal = $('#modal-global-top-search');
            globalSearchForm = $('#global-sdp-search-form');
            searchInputField = $('#global-sdp-form-search-field');
            searchResultList = modalSearchGlobal.find('.inner-result-sec');
        };

        var _addEvent = function(){
            globalSearchForm.on({
                submit: _onSubmitSearchHandler
            })
        };

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// Event Handler

        var _onSubmitSearchHandler = function(e){
            // todo submit logic 처리
        };


        var _completeShownSearchModal = function(){
            searchInputField.focus();
            // todo 검색 레이어가 활성되었을 때 Callback 작성
            console.log('헤더 쪽 검색 모달을 열었을 때 로직 실행')
        };

        var _closeSearchModal = function(){
            console.log('헤더 쪽 검색 모달을 닫힐 때')
            // _initSearchFormData();
        };

        var _initSearchFormData = function(){
            searchInputField.val('');
            //searchResultList.empty();
        };

        return {
            init: _init,
            shown_modal: _completeShownSearchModal,
            close_search_modal: _closeSearchModal
        };

    })();

    ns.search.top_global_search = TopGlobalSearch;

}(SdpApp || {}, jQuery));