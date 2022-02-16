const {src, dest, series} = require('gulp');
const pkg = require('../package.json');
const {cfg} = require('../presets/config');
const {
  $,
  DIST_DEV_JS_DIR,
  DIST_VENDORS_JS_NAME,
  DIST_COMMON_JS_NAME,
  DIST_PRODUCT_JS_DIR,
  BANNER_INFO,
  BUILD_VENDOR_JS_NAME,
  BUILD_COMMON_JS_NAME,
  ON_ERROR
} = require('../presets/presetConstant');

let isDev = true;

function buildJS($source_path, $target_path) {
  $.fancyLog("-> Building js", $source_path, $target_path);

  if (isDev) {
    setTimeout(() => {
      src($source_path)
          .pipe($.plumber({errorHandler: ON_ERROR}))
          .pipe($.newer({dest: $target_path}))
          .pipe(dest($target_path))
          .pipe($.livereload({stream: true}));
    }, 2500)
  } else{
    setTimeout(() => {
      src($source_path)
          .pipe($.uglify())
          .pipe($.header(BANNER_INFO, {pkg: pkg}))
          .pipe($.size({gzip: true, showFiles: true}))
          .pipe(dest($target_path))
      //.pipe($.filter("**/*.js"))
    }, 2000)
  }
}

function concatJS($source_path, $target_path, $concat_name, $mode, $file_type) {
  $.fancyLog("-> Concat js", $source_path, $target_path, $concat_name, $mode, $file_type, isDev);
  if (isDev) {
    src($source_path)
        .pipe($.plumber({errorHandler: ON_ERROR}))
        //.pipe($.newer({dest: $target_path, ext: ".min.js"}))
        .pipe($.sourcemaps.init({loadMaps: true}))
        .pipe($.concat($concat_name))
        .pipe($.sourcemaps.write("./"))
        //.pipe($.rename({suffix: ".min"}))
        .pipe(dest($target_path))
  } else {
    // product mode
    if ($file_type == 'common') $source_path = [$source_path[0], $source_path[1]] //common파일 경우 재정의

    src($source_path)
        .pipe($.concat($concat_name))
        .pipe($.stripDebug()) //remove Strip console, alert, and debugger statements from JavaScript code with strip-debug
        .pipe(dest($target_path))
  }
}

//Dynamic Modules Join
let ArrSrcModuleFiles = cfg.filelist.moduleContentJs.map(item => item.split('interactive')[1].split('/')[1]);
let ArrModuleFileNames = [];


function getModulesJS (idx){
  ArrModuleFileNames.push((ArrSrcModuleFiles.length ? cfg.buildFileNames.aliasKeyword + '.' : '') + ArrSrcModuleFiles[idx] + '.js');
}
function generateModuleFileNames(){
  for (let i = 0; i < ArrSrcModuleFiles.length; i++) {
    if(!ArrModuleFileNames.length) getModulesJS (i);
    concatJS(cfg.filelist.moduleContentJs[i], cfg.paths.build.js, ArrModuleFileNames[i]);
  }
}

function getJsModuleFileNames(){
  if(!ArrModuleFileNames.length){
    for (let i = 0; i < ArrSrcModuleFiles.length; i++) {
      getModulesJS (i);
    }
  }
  return ArrModuleFileNames;
};


function toBuildConcatModules($sourceFiles) {
  let tmpArr = [];
  for (let i = 0; i < $sourceFiles.length; i++) {
    tmpArr.push(cfg.paths.build.js + $sourceFiles[i]);
    if (isDev) tmpArr.push(cfg.paths.build.js + $sourceFiles[i] + '.map');
  }
  return tmpArr;
}

// task
function vendorJS(cb){
  concatJS(cfg.filelist.vendorJs, cfg.paths.build.js, DIST_VENDORS_JS_NAME);
  cb();
}

function jsDev(cb) {
  console.log('jsDev')
  isDev = true;
  concatJS(cfg.filelist.vendorJs, cfg.paths.build.js, DIST_VENDORS_JS_NAME);
  concatJS(cfg.filelist.commonJs, cfg.paths.build.js, DIST_COMMON_JS_NAME);
  buildJS(toBuildConcatModules(BUILD_VENDOR_JS_NAME), DIST_DEV_JS_DIR);
  buildJS(toBuildConcatModules(BUILD_COMMON_JS_NAME), DIST_DEV_JS_DIR);
  generateModuleFileNames();
  buildJS(toBuildConcatModules(ArrModuleFileNames), DIST_DEV_JS_DIR);
  cb();
}

function jsProd(cb) {
  isDev = false;
  concatJS(cfg.filelist.vendorJs, cfg.paths.build.js, DIST_VENDORS_JS_NAME);
  concatJS(cfg.filelist.commonJs, cfg.paths.build.js, DIST_COMMON_JS_NAME);
  buildJS(toBuildConcatModules(BUILD_VENDOR_JS_NAME), DIST_PRODUCT_JS_DIR);
  buildJS(toBuildConcatModules(BUILD_COMMON_JS_NAME), DIST_PRODUCT_JS_DIR);
  generateModuleFileNames();
  buildJS(toBuildConcatModules(ArrModuleFileNames), DIST_PRODUCT_JS_DIR);
  cb();
}

module.exports = {
  jsDev,
  jsProd,
  getJsModuleFileNames,
  vendorJS
};
