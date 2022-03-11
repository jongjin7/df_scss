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
const isContentJs = cfg.filelist.contentJs.length;

function buildJS($source_path, $target_path) {
  $.fancyLog("-> Building js", $source_path, $target_path);

  if (isDev) {
    setTimeout(() => {
      src($source_path)
          .pipe($.plumber({errorHandler: ON_ERROR}))
          .pipe($.newer({dest: $target_path}))
          .pipe(dest($target_path))
    }, 5000)
  } else{
    setTimeout(() => {
      src($source_path)
          .pipe($.uglify())
          .pipe($.header(BANNER_INFO, {pkg: pkg}))
          .pipe($.size({gzip: true, showFiles: true}))
          .pipe(dest($target_path))
      //.pipe($.filter("**/*.js"))
    }, 5000)
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
    src($source_path)
        .pipe($.concat($concat_name))
        .pipe($.stripDebug()) //remove Strip console, alert, and debugger statements from JavaScript code with strip-debug
        .pipe(dest($target_path))
  }
}

function toBuildConcatModules($sourceFiles) {
  console.log('tmpArr', $sourceFiles)
  let tmpArr = [];
  for (let i = 0; i < $sourceFiles.length; i++) {
    tmpArr.push(cfg.paths.build.js + $sourceFiles[i]);
    if (isDev) tmpArr.push(cfg.paths.build.js + $sourceFiles[i] + '.map');
  }
  return tmpArr;
}

// task
function copyJS($sourceFiles, $target_path){
  $.fancyLog("-> copyJS",$sourceFiles, $target_path);
  const sourceFiles = typeof $sourceFiles === 'function' ? cfg.filelist.contentJs : $sourceFiles;
  const targetPath = typeof $target_path === 'undefined' ? DIST_DEV_JS_DIR : $target_path;
  return src(sourceFiles)
      .pipe($.newer(targetPath))
      .pipe($.plumber({errorHandler: ON_ERROR}))
      .pipe(dest(targetPath))
      .pipe($.livereload({stream: true}));
}

function jsDev(cb) {
  console.log('jsDev')
  isDev = true;
  concatJS(cfg.filelist.vendorJs, cfg.paths.build.js, DIST_VENDORS_JS_NAME);
  concatJS(cfg.filelist.commonJs, cfg.paths.build.js, DIST_COMMON_JS_NAME);
  buildJS(toBuildConcatModules(BUILD_VENDOR_JS_NAME), DIST_DEV_JS_DIR);
  buildJS(toBuildConcatModules(BUILD_COMMON_JS_NAME), DIST_DEV_JS_DIR);
  if(isContentJs) copyJS(cfg.filelist.contentJs, DIST_DEV_JS_DIR);
  cb();
}

function jsProd(cb) {
  isDev = false;
  concatJS(cfg.filelist.vendorJs, cfg.paths.build.js, DIST_VENDORS_JS_NAME);
  concatJS(cfg.filelist.commonJs, cfg.paths.build.js, DIST_COMMON_JS_NAME);
  buildJS(toBuildConcatModules(BUILD_VENDOR_JS_NAME), DIST_PRODUCT_JS_DIR);
  buildJS(toBuildConcatModules(BUILD_COMMON_JS_NAME), DIST_PRODUCT_JS_DIR);
  if(isContentJs) copyJS(cfg.filelist.contentJs, DIST_PRODUCT_JS_DIR);
  cb();
}

module.exports = {
  jsDev,
  jsProd,
  copyJS,
  isContentJs
};
