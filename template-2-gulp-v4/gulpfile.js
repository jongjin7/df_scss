const {series, parallel, watch} = require('gulp');
const {cfg} = require('./presets/config');
const del = require('del');
const {
  $,
  WORK_SRC,
  DIST_DEV_BASE_DIR,
} = require('./presets/presetConstant');

const {htmlDev, htmlProd} = require('./tasks/TaskHTML');
const {jsDev, jsProd, vendorJS} = require('./tasks/TaskScript');
const {CssDev, CssProd, SCSS_Compile} = require('./tasks/TaskCSS');
const {copyDev, copyProd, copyImg} = require('./tasks/TaskCopyAssets');


// The `clean` function is not exported so it can be considered a private task.
// It can still be used within the `series()` composition.
function clean($target_dir, cb) {
  console.log('clean!!')
  del($target_dir);
  cb();
}

function cleanTaskDev(cb){
  clean('./dist/dev', cb)
}

function cleanTaskProd(cb){
  clean('./dist/prd', cb)
}

function cleanAllTask(cb){
  clean([cfg.paths.build.base, './dist'], cb)
}

function devServer() {
  $.browserSync.init({
    server: {
      baseDir: DIST_DEV_BASE_DIR,
    },
    port: cfg.gulp.port,
    browser: ['chrome'], //서버 실행시 띄우고자하는 브라우저 (firefox, opera)
    startPath: cfg.paths.start_serve_html
  });
}

function watchTask(cb) {
  watch(WORK_SRC + cfg.paths.src.scss + "**/**/**/**/*.scss", SCSS_Compile);
  watch(WORK_SRC + cfg.paths.src.js + "**/**/*.js", jsDev);
  watch(WORK_SRC + cfg.filelist.imgs, copyImg);
  watch(WORK_SRC + cfg.paths.src.html + "**/**/*.html", htmlDev);
  cb();
}

exports.clean = series(cleanAllTask);
exports.build = series(cleanTaskProd, vendorJS, parallel(jsProd, htmlProd, CssProd, copyProd));
exports.default = series(cleanTaskDev, copyDev, parallel(htmlDev, jsDev, CssDev), devServer, watchTask);
