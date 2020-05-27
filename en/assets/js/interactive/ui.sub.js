/*=========================================================== [ UI ] =======================================================================*/

(function(ns){
    var Module = (function(){
        var _init = function(){

            console.log('UI Module Start!', DF.utils.getScrollPosY(document.querySelector('body')))
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


        };

        return {
            init: _init
        }
    })();

    ns.ui.sub = Module;

}(App || {}));

