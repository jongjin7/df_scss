const {cfg} = require('../presets/config');
const {src, dest, series} = require('gulp');
const { getJsModuleFileNames } = require( './TaskScript');
const {
  $,
  WORK_SRC,
  DIST_DEV_HTML_DIR,
  DIST_PRODUCT_HTML_DIR,
  DIST_VENDORS_JS_NAME,
  DIST_COMMON_JS_NAME,
  DIST_VENDORS_CSS_NAME
} = require('../presets/presetConstant');

const resData = {
  resourceFiles:{
    vendorJs: DIST_VENDORS_JS_NAME,
    commonJs: DIST_COMMON_JS_NAME,
    modulesJs: getJsModuleFileNames(),
    vendorCSS: DIST_VENDORS_CSS_NAME,
    globalCSS: cfg.buildFileNames.aliasKeyword + '.' +'global.css',
    appCSS: cfg.buildFileNames.aliasKeyword + '.' + 'app.css'
  }
}

let isDev = true;


function generateHTML($target_path) {
  $.fancyLog("-> Generate Html", $target_path, cfg.filelist.html, cfg.buildFileNames.aliasKeyword);
  return src(cfg.filelist.html)
      //.pipe($.ignore.exclude(WORK_SRC + 'inc/!*.html'))
      //mozilla nunjucksRender
      //.pipe($.newer({dest: $target_path, ext: ".html"}))
      .pipe($.data(() => (resData)))
      .pipe($.nunjucksRender({
        envOptions: {
          autoescape: false
        },
        //manageEnv: manageEnvironment,
        path: [
          WORK_SRC + 'inc'
        ],
        css_path: 'http://company.com/css/',
        data: {
          // prefix_name : isAliasName? cfg.buildFileNames.aliasKeyword +'.' :''
        }
      }))
      .on('error', function (e) {
        console.log(e);
        this.emit('end');
      })
      .pipe($.prettyHtml())
      .pipe(dest($target_path))
}


function htmlDev(cb) {
  generateHTML(DIST_DEV_HTML_DIR)
  cb();
}

function htmlProd(cb) {
  generateHTML(DIST_PRODUCT_HTML_DIR)
  cb();
}

module.exports = {
  htmlProd,
  htmlDev
};
