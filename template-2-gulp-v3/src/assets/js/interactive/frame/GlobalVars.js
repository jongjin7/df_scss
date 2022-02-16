/*=========================================================== [ Global Variables ] =======================================================================*/
if (typeof window.GlobalVars == 'undefined' || !window.GlobalVars) {
    window.GlobalVars = {
        isDevMode: false,
        isDevModeCss: false,
        isShowTopNav: true,

        DeviceType: {
            DESKTOP: 'desktop',
            TABLET: 'tablet',
            MOBILE: 'mobile'
        },

        BreakPoint:{
            DESKTOP: 1124,
            TABLET: 768,
            MOBILE: 0
        },

        WindowInfo: {
            width: '',
            height: '',
            scrollTop: '',
            scrollBottom: '',
        },

        fixedType: {
            SUBNAV : 'sub_nav'
        },
        CurrentScreenType: '',
        OldScreenType: '',
        getScrollTop : 0,
        getFixedScrollTop : 0,
        headerH : 64,
        fixedTopClassName:'fixed-top'
    }


}

/*=========================================================== [ Global Event Constants Name ] =======================================================================*/
if (typeof window.GlobalEvent == 'undefined' || !window.GlobalEvent) {
    window.GlobalEvent = {};
    window.GlobalEvent.SCROLL = "scroll";
    window.GlobalEvent.RESIZE = "resize";
    window.GlobalEvent.CHANGE_DEVICE_SIZE = "change_device_size";
    window.GlobalEvent.MOUSE_WHEEL = "mousewheel";
}

