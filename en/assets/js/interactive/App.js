/*=========================================================== [ Define App's Object ] =======================================================================*/

if (typeof window.App == 'undefined' || !window.App) {
    window.App = {};
}

App.namespace = function (ns_string) {
    let parts = ns_string.split('.'), parent = App, i; // 처음에 중복되는 전역 객체명은 제거한다.
    if (parts[0] === 'App') {
        parts = parts.slice(1);
    }

    for (i = 0; i < parts.length; i++ ) {
        if (typeof parent[parts[i]] === 'undefined') {
            parent[parts[i]] = {};
        }

        parent = parent[parts[i]];
    }

    return parent;
};

// namespace 구성
App.namespace('App.ui');
App.namespace('App.content');


/*=========================================================== [ Global Event  ] =======================================================================*/
if (typeof window.GlobalEvent == 'undefined' || !window.GlobalEvent) {
    window.GlobalEvent = {};
    window.GlobalEvent.CHANGE_SCROLL = "change_scroll";
    window.GlobalEvent.CHANGE_RESIZE = "change_resize";
    window.GlobalEvent.CHANGE_DEVICE_SIZE = "change_device_size";
    window.GlobalEvent.MOUSE_WHEEL = "mousewheel";
}

/*=========================================================== [ App Start ] =======================================================================*/

// Module Loading!
define(['jquery','swiper'], function ($, Swiper) {

    const Common = (function(ns){
        var _init = function(){
            ScrollEvent.created();
            ResizeEvent.created();

            ns.ui.main.init();
            ns.ui.sub.init();




        };

        return {
            init: _init
        }
    })(App);

    App.common = Common;

    $(document).ready(function(){
        App.common.init();
        $('#app').addClass('show');
    });

    // App 전역객체 배포
    return App;
});



