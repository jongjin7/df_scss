/*=========================================================== [ UI ] =======================================================================*/
define(['app','swiper'], function (App,Swiper) {
    const Module = (function (ns) {
        const _init = function () {

            console.log('UI Module Start!', ns,  DF.utils.getScrollPosY(document.querySelector('body')))
            /*$(".sec-4").on("mousewheel", function(event, delta, deltaX, code, detail, deltaFactor){
                console.log( deltaX, event, code, deltaFactor);
                // if(delta>0){
                //     //마우스 휠 up
                //     $(this).css("background", "red");
                //     $("p").text("마우스 휠을 위로!");
                // }else if(delta<0){
                //     //마우스 휠 down
                //     $(this).css("background", "black");
                //     $("p").text("마우스 휠을 아래로!");
                // }
            });*/

            var mySwiper = new Swiper ('.swiper-container', {
                // Optional parameters
                loop: true,
                spaceBetween:30,

                // If we need pagination
                pagination: {
                    el: '.swiper-pagination',
                },

                // Navigation arrows
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },


            })



        };

        return {
            init: _init
        }
    })(App);

    App.ui.sub = Module;
});

