/*=========================================================== [ 스크립트 종류 ] =======================================================================*/

console.log('main console!');

// 병원 갤러리
var _gallerySwiper = function(){
    var galleryContainer = $('#gallery-container');
    var galleryTopContainer = galleryContainer.find('.gallery-top');
    var galleryThumbContainer = galleryContainer.find('.gallery-thumbs > .list-wrap');

    //갤러리 썸네일 리스트 생성
    var galleryList = galleryTopContainer.find('.swiper-wrapper').children();
    var tempArr =[];
    galleryList.each(function(idx){
        var targetReplace ='figcaption';
        //console.log('aaa', $(this).html().replace(targetReplace, targetReplace +' data-num="'+ idx +'"'))
        tempArr.push('<a href="#" onclick="return false;" class="'+ $(this).attr('class') +'">'+ $(this).html().replace(targetReplace, targetReplace +' data-num="'+ (idx+1) +'"') +'</a>');
    });

    galleryThumbContainer.html(tempArr);

    var galleryThumbsOptions;
    var galleryTopOptions;
    if(Detectizr.device.type == 'mobile'){
        galleryThumbsOptions = {
            slidesPerView: 3,
            freeMode: true,
            watchSlidesVisibility: true,
            watchSlidesProgress: true,
        }
    }else{
        galleryThumbsOptions = {
            slidesPerView: 6,
            freeMode: true,
            watchSlidesVisibility: true,
            watchSlidesProgress: true,
        }
    }
    //갤러리 썸네일 슬라이드
    var galleryThumbs = new Swiper('.gallery-thumbs', galleryThumbsOptions);

    if(Detectizr.device.type == 'mobile'){
        galleryTopOptions = {
            spaceBetween: 10,
            thumbs: {
                swiper: galleryThumbs,
            },
        };
    }else{
        galleryTopOptions = {
            spaceBetween: 10,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            thumbs: {
                swiper: galleryThumbs,
            },
        };
    }
    //갤러리 상단 슬라이드
    var galleryTop = new Swiper('.gallery-top', galleryTopOptions);
};
_gallerySwiper();