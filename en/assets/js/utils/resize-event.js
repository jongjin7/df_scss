
var ResizeEvent = (function(){
    var _isDeviceSizeChange = false;

    var _created = function () {
        window.addEventListener('resize', _resizeHandler);
        _resizeHandler();
    }


    var _resizeHandler = function () {
        var w = window.innerWidth;
        var h = window.innerHeight;

        if (w < window.GlobalVars.SIZE_MOBILE) {
            window.GlobalVars.isSizeMobile = true;

        } else {
            window.GlobalVars.isSizeMobile = false;
        }
        $(window.GlobalEvent).trigger(window.GlobalEvent.CHANGE_RESIZE, w, h);


        if (w > window.GlobalVars.SIZE_MOBILE) {
            if (!_isDeviceSizeChange) {
                _isDeviceSizeChange = true;
                //EventBus.$emit(EventBus.CHANGE_DEVICE_SIZE, w, h);
                $(window.GlobalEvent).trigger(window.GlobalEvent.CHANGE_DEVICE_SIZE, w, h);
            }
        } else {
            if (_isDeviceSizeChange) {
                _isDeviceSizeChange = false;
                //EventBus.$emit(EventBus.CHANGE_DEVICE_SIZE, w, h);
                $(window.GlobalEvent).trigger(window.GlobalEvent.CHANGE_DEVICE_SIZE, w, h);
            }

        }

        //EventBus.$emit(EventBus.CHANGE_SCROLL, DF.utils.getScrollPosY())
        $(window.GlobalEvent).trigger(window.GlobalEvent.CHANGE_SCROLL, DF.utils.getScrollPosY());
    }

    return{
        created: _created
    }
})();
