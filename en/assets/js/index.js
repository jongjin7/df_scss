requirejs.config({
    baseUrl: './assets/vendors',
    paths: {
        app: '../test',
        jquery:'jquery-3.4.1.min',
        swiper:'swiper/swipe'
    }
});

const vendorFiles =['modernizr-detectizr','jquery.mousewheel'];

const pathCommon = '../js/common/';
const commonFiles = ['GA_TrackingCode','GlobalVars','share.api'];


const pathUtil = '../js/utils/';
const utilFiles = ['DF.utils', 'DF.validator', 'layout','resize-event','scroll-event'];

const pathInteractive = '../js/interactive/';
const appFiles = ['App', 'ui', 'ui.sub'];


requirejs(vendorFiles);

//커먼 모듈
let tmpCommonArr =[];
commonFiles.forEach(function(filename){
    tmpCommonArr.push(pathCommon + filename);
});
requirejs(tmpCommonArr);

//유틸 모듈
let tmpUtilArr =[];
utilFiles.forEach(function(filename){
    tmpUtilArr.push(pathUtil + filename);
});
requirejs(tmpUtilArr);

//앱 모듈
let tmpAppArr =[];
appFiles.forEach(function(filename){
    tmpAppArr.push(pathInteractive + filename);
});
requirejs(tmpAppArr);
