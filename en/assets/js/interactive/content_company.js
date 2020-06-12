/*=========================================================== [ Contents ] =======================================================================*/
define(['app','Gsap'], function (App, Gsap) {
    let scrollTop;

    const Company = (function (ns) {
        let scrollBottom;
        const _init = function (Swiper) {

            console.log('Company init!', )
            _addEvent();

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

            let tmpWheelCount =0;

            $('.sec-1 .pannel').on("touchstart touchmove touchend", function(event) {

                event.preventDefault();
                console.log(event.type)
                tmpWheelCount++;

                var delta = event.originalEvent.deltaY / 120 || -event.originalEvent.detail / 3;
                console.log('company', delta, tmpWheelCount)
                if(delta > 0) {
                    //_showPopup();
                }
            });


        };

        const _addEvent = function(){
            $(window.GlobalEvent).on(window.GlobalEvent.CHANGE_SCROLL, _onScroll);
        };

        const _onScroll = function(e, $val){
            console.log('contentCompany _onScroll')
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
            const imgbox = $('.popup .img')[0];
            const nextSection = $('.popup .content')[0];
            let value = window.pageYOffset / nextSection.offsetTop + 1;
            imgbox.style.transform = 'scale('+ value+ ')';
        };

        const _showPopup = function(){
            $('main').addClass('show');
            $('.popup').show();





            var $window = $(window);        //Window object

            var scrollTime = 1.2;           //Scroll time
            var scrollDistance = 170;       //Distance. Use smaller value for shorter scroll and greater value for longer scroll

            $window.on("mousewheel.pop", function(event){

                event.preventDefault();

                var delta = event.originalEvent.deltaY/120 || -event.originalEvent.detail/3;
                var finalScroll = scrollTop - parseInt(delta*scrollDistance);

                console.log('finalScroll', scrollTop, finalScroll, delta, Power1.easeOut)
                Gsap.to(window, scrollTime, {
                    scrollTo : { y: finalScroll, autoKill: true},
                    ease: Power1.easeOut,
                    autoKill: true,
                    overwrite: 5
                });

            });


        }

        const _hidePopup = function(){
            $('main').removeClass('show');
            $('.popup').hide();
            $('.popup .img').removeClass('fixed').removeAttr('style');
            $(window).off('scroll.pop');
            $(window).off("mousewheel.pop DOMMouseScroll.pop");
        }

        const _setElementFocus = function (elem, scrollBottom) {
            var ty = window.GlobalVars.isSizeMobile ? elem.offset().top : elem.offset().top + elem.height() * 0.2;
            if (scrollBottom > ty) {
                if (scrollBottom - window.innerHeight > elem.offset().top + elem.height()) {
                    if (elem.hasClass('onTrans')) {
                        console.log('has conTrans')
                    }
                } else {
                    if (!elem.hasClass('onTrans')) {
                        elem.addClass('onTrans');
                        console.log(elem)
                    }
                }
            }
            if (scrollBottom < elem.offset().top) {
                if (elem.hasClass('onTrans')) {
                    elem.removeClass('onTrans');
                }
            }

        };

        return {
            init: _init
        }
    })(App);

    App.content.company = Company;
});
