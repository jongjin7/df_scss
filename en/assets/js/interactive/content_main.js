/*=========================================================== [ Contents ] =======================================================================*/
define(['app', 'TweenMax','TweenScrollTo'], function (App, Gsap) {
    const ContentMain = (function (ns) {
        let scrollTop;
        const _init = function () {
            console.log('content main init!')

            $(window.GlobalEvent).on(window.GlobalEvent.CHANGE_SCROLL, _onScroll);




        };

        const _addEvent = function(){

        };

        const _onScroll = function(e, $val){
            //console.log('content main _onScroll')
            if(typeof e !== "undefined") {
                scrollTop = Math.round($val);
            }else{
                scrollTop = Math.round($(window).scrollTop());
            }
            _scrollContent();
        };

        const _onResize = function(){

        };

        /////////////////////////////////////////////////////////////////////////////////////

        const _scrollContent = function(){


        };



        return {
            init: _init,
        }
    })(App);

    App.content.main = ContentMain;
});
