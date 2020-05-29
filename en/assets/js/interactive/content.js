/*=========================================================== [ Contents ] =======================================================================*/
define(['app'], function (App) {
    const Content = (function (ns) {
        let scrollBottom;
        const _init = function () {

            console.log('content init!')


        };

        const _addEvent = function(){

        };

        const _onScroll = function(){

        };

        const _onResize = function(){

        };

        /////////////////////////////////////////////////////////////////////////////////////

        const _sec_1 = function(){

        };

        const _setElementFocus = function (elem, scrollBottom) {
            var ty = window.GlobalVars.isSizeMobile ? elem.offset().top : elem.offset().top + elem.height() * 0.2;
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

        return {
            init: _init
        }
    })(App);

    App.content = Content;
});
