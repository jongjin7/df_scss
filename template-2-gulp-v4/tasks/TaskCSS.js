const {src, dest, series} = require('gulp');
const pkg = require('../package.json');
const {cfg} = require('../presets/config');
const SCSS = require('gulp-sass')(require('node-sass'));

const {
  $,
  BANNER_INFO,
  DIST_DEV_CSS_DIR,
  DIST_PRODUCT_CSS_DIR,
  DIST_VENDORS_CSS_NAME,
  ON_ERROR
} = require('../presets/presetConstant');

let isDev = true;

function concatCSS_Dev($source_path, $concat_file_name, $target_path) {
  $.fancyLog("-> CSS Vendor Concat");
  return src($source_path)
      .pipe($.plumber({errorHandler: ON_ERROR}))
      .pipe($.sourcemaps.init())
      .pipe($.concat($concat_file_name))
      .pipe($.sourcemaps.write("./"))
      .pipe(dest($target_path))
}

function concatCSS_Prod($source_path, $concat_file_name, $target_path) {
  return src($source_path)
      .pipe($.plumber({errorHandler: ON_ERROR}))
      .pipe($.concat($concat_file_name))
      .pipe($.cssmin())
      .pipe($.header(BANNER_INFO, {pkg: pkg}))
      .pipe($.size({gzip: true, showFiles: true}))
      .pipe(dest($target_path))
}


// SCSS Compile
function compileToCSS_Dev($target_path) {
  $.fancyLog("-> Transpilling SCSS");
  return src(cfg.filelist.workScss)
      .pipe($.sourcemaps.init({loadMaps: true}))
      .pipe($.rename(path =>{
        path.basename = cfg.buildFileNames.aliasKeyword +'.'+ path.basename
      }))
      .pipe(SCSS({outputStyle: 'expanded'}).on("error", SCSS.logError))
      .pipe($.cached("sass_compile"))
      .pipe($.autoprefixer())
      .pipe($.sourcemaps.write("./"))
      .pipe(dest($target_path))
      .pipe($.livereload({stream: true}));
}

function compileToCSS_Prod($target_path, isPress) {
  return src(cfg.filelist.workScss)
      .pipe(SCSS({outputStyle: isPress ? 'compressed' : 'expanded'}).on("error", SCSS.logError))
      .pipe($.rename(path =>{
        path.basename = cfg.buildFileNames.aliasKeyword +'.'+ path.basename
      }))
      .pipe($.autoprefixer())
      .pipe($.header(BANNER_INFO, {pkg: pkg}))
      .pipe(dest($target_path))
}

function SCSS_Compile(cb){
  if(isDev) compileToCSS_Dev(DIST_DEV_CSS_DIR);
  else compileToCSS_Prod(DIST_PRODUCT_CSS_DIR, true); // css output style => true: compress, false: expanded
  cb();
}

function CssDev(cb) {
  isDev = true;
  concatCSS_Dev(cfg.filelist.vendorCss, DIST_VENDORS_CSS_NAME, DIST_DEV_CSS_DIR);
  SCSS_Compile(cb);
  cb();
}

function CssProd(cb) {
  isDev = false;
  concatCSS_Prod(cfg.filelist.vendorCss, DIST_VENDORS_CSS_NAME, DIST_PRODUCT_CSS_DIR);
  SCSS_Compile(cb);
  cb();
}




module.exports = {
  CssDev,
  CssProd,
  SCSS_Compile,
};
