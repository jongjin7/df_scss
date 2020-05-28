const ScrollEvent = (function(){
    let _scrollTop;

    const _created = function () {
        window.addEventListener('scroll', _scrollHandler);
    };

    const _scrollHandler = function () {
        let top = DF.utils.getScrollPosY();

        if (_scrollTop != top) {
            _scrollTop = top;
            $(window.GlobalEvent).trigger(window.GlobalEvent.CHANGE_SCROLL, _scrollTop);
        }
    };

    return{
        created: _created
    }
})();

/*
Vue.directive('scroll', {
    inserted: function (el, binding) {
        let f = function (evt) {
            if (binding.value(evt, el)) {
                //window.removeEventListener('scroll', f);
                EventBus.$off(evt, f);
            }
        };
        //window.addEventListener('scroll', f);
        EventBus.$on(EventBus.CHANGE_SCROLL, f);
    }
});*/
