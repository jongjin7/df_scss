requirejs.config({
    baseUrl: './assets',
    paths: {
        jquery:'vendors/jquery-3.4.1.min',
        swiper:'vendors/swiper/swipe',
        app:'./js/interactive/App'
    }
});

const vendorFiles =['vendors/modernizr-detectizr','vendors/jquery.mousewheel'];
//requirejs(vendorFiles);

const pathCommon = './js/common/';
const commonFiles = ['GA_TrackingCode','GlobalVars','share.api'];

const pathUtil = './js/utils/';
const utilFiles = ['DF.utils', 'DF.validator','resize-event','scroll-event'];

const pathInteractive = './js/interactive/';
const appFiles = ['frame', 'ui.sub'];



//커먼 모듈
let tmpCommonArr =[];
if(commonFiles.length > 0){
    commonFiles.forEach(function(filename){
        tmpCommonArr.push(pathCommon + filename);
    });
    tmpCommonArr = tmpCommonArr.concat(vendorFiles);
}
//requirejs(tmpCommonArr);

//유틸 모듈
let tmpUtilArr =[];
utilFiles.forEach(function(filename){
    tmpUtilArr.push(pathUtil + filename);
});
//requirejs(tmpUtilArr);

//앱 모듈
let tmpAppArr =[];
appFiles.forEach(function(filename){
    tmpAppArr.push(pathInteractive + filename);
});

//최종 js 배열 합치기
requirejs(tmpCommonArr.concat(tmpUtilArr).concat(tmpAppArr));
