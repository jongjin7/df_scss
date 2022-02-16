(function(ns, $, undefined){

    var loader = (function(){
        var _arrImages = [],
            _dateObj = "",
            _index = 0,
            _searchNum = 0,
            _isBodyElement = false,
            _callBackFunc="",
            _tempImageContainer = "";

        var _init = function(){
            console.log('loader.js init!')
                //_dateObj = new Date();
            },

            // html 로드
            _html = function($url, $callbackFunc){
                var callBackFunc = $callbackFunc

                $.ajax({
                    url: $url,
                    cache: false,
                    statusCode: {
                        404: function() {
                            //window.location.href="404.html"
                            alert("404 Error");
                        }
                    },
                    success: function(html){
                        callBackFunc(html);
                    }
                });
            },

            // XML 로드
            _xml = function($url, $callbackFunc){

                var dateObj = new Date(),
                callBackFunc = $callbackFunc,
                    url = $url+"?time="+dateObj.getTime();

                if(ns.selectedCategoryIdx == ns.INDEX_SEARCH){
                    url = url+"&q="+ns.query;
                }

                $.ajax({
                    type:"get",
                    dataType:"xml",
                    //dataType:"jsonp",
                    url: url,
                    success: function(xml){
                        callBackFunc(xml);
                    },
                    error: function(xhr, status, error) {
                        //alert(status);
                        //alert(error);
                        console.log("xml load error");
                    }
                });
            },

            // 이미지 로드
            _image = function($selector, $url, $callbackFunc, $idx){
                $('<img/>').attr('src', $url).on('load', function() {
                    $(this).remove(); // prevent memory leaks as @benweet suggested
                    $selector.css('background-image', 'url('+$url+')').addClass('complete');
                    $callbackFunc($idx);
                });
            },


            _image_old = function($selector, $callbackFunc, $idx){
                var len = $selector.find("img").length,
                    num = 0,
                    i = 0,
                    callbackFunc = $callbackFunc;

                for(i=0; i<len; i++){
                    var img = $selector.find("img")[i],
                        url = $(img).attr("data-src"),
                        extra = "";

                    if(ns.isIE8){
                        extra = "?" + Math.floor(Math.random() * 3000);
                        url = url+extra;
                    }

                    $(img).attr("src", url).load(function(){
                        num++
                        if(num == len){
                            callbackFunc($idx);
                        }
                    });
                }
            }

        return {
            init : _init,
            html : _html,
            xml : _xml,
            image : _image
        };
    })();

    ns.loader = loader;

}(App || {}, jQuery));
