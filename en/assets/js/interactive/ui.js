/*=========================================================== [ UI ] =======================================================================*/


    (function (ns) {
        var UI = (function () {
            var _init = function () {

                console.log('UI Start', ns, Detectizr.device)

                ns.ui.sub.init();

            };

            return {
                init: _init
            }
        })();

        ns.ui.main = UI;

    }(App || {}));

