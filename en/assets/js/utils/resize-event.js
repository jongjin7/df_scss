const ResizeEvent = (function(){
    let _isDeviceSizeChange = false;

    let _created = function () {
        window.addEventListener('resize', _resizeHandler);
        _resizeHandler();
    };


    const _resizeHandler = function () {
        let w = window.innerWidth;
        let h = window.innerHeight;

        if (w < window.GlobalVars.SIZE_MOBILE) {
            window.GlobalVars.isSizeMobile = true;

        } else {
            window.GlobalVars.isSizeMobile = false;
        }
        $(window.GlobalEvent).trigger(window.GlobalEvent.CHANGE_RESIZE,  {width:w, height:h});


        if (w > window.GlobalVars.SIZE_MOBILE) {
            if (!_isDeviceSizeChange) {
                _isDeviceSizeChange = true;
                //EventBus.$emit(EventBus.CHANGE_DEVICE_SIZE, w, h);
                $(window.GlobalEvent).trigger(window.GlobalEvent.CHANGE_DEVICE_SIZE,  {width:w, height:h});
            }
        } else {
            if (_isDeviceSizeChange) {
                _isDeviceSizeChange = false;
                //EventBus.$emit(EventBus.CHANGE_DEVICE_SIZE, w, h);
                $(window.GlobalEvent).trigger(window.GlobalEvent.CHANGE_DEVICE_SIZE,  {width:w, height:h});
            }

        }

        //EventBus.$emit(EventBus.CHANGE_SCROLL, DF.utils.getScrollPosY())
        $(window.GlobalEvent).trigger(window.GlobalEvent.CHANGE_SCROLL, {top: DF.utils.getScrollPosY()});
        $(window.GlobalEvent).trigger('myEvent', {width:w, height:h})
    };

    return{
        created: _created
    }
})();
