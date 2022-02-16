const { series, src, dest, lastRun } = require('gulp');
const {cfg} = require('../presets/config');
const imagemin = require('gulp-imagemin'); // version 7.1사용
// @ref: https://www.npmjs.com/package/gulp-imagemin

const {
  $,
  WORK_SRC,
  DIST_DEV_IMG_DIR,
  DIST_PRODUCT_IMG_DIR,
  DIST_DEV_FONT_DIR,
  DIST_PRODUCT_FONT_DIR,
  DIST_DEV_BASE_DIR,
  DIST_PRODUCT_BASE_DIR,
  ON_ERROR
} = require('../presets/presetConstant');

let isDev = true;

function copyTask($source_src, $target_path) {
  // body omitted
  $.fancyLog('-> copy:', $source_src, $target_path)
  return src($source_src)
      .pipe($.plumber({errorHandler: ON_ERROR}))
      .pipe(dest($target_path));
}

function imageTask($source_src, $target_path) {
  $.fancyLog('-> image optimize:', $source_src, $target_path)
  return src($source_src, { since: lastRun(imageTask) })
      .pipe($.plumber({errorHandler: ON_ERROR}))
      .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.mozjpeg({quality: 75, progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({
          plugins: [
            {removeViewBox: true},
            {cleanupIDs: false}
          ]
        })
      ]))
      .pipe(dest($target_path));
}


function copyImg(dist){
  // 심플 이미지 복사
  copyTask(cfg.filelist.imgs, dist);

  // 이미지 최적화
  //imageTask(cfg.filelist.imgs, dist);
}


function copyDev(cb){
  isDev = true;
  copyTask(cfg.filelist.fonts, DIST_DEV_FONT_DIR);
  copyImg(DIST_DEV_IMG_DIR);
  copyTask(WORK_SRC +'index.html', DIST_DEV_BASE_DIR);
  cb();
}

function copyProd(cb){
  isDev = false;
  copyTask(cfg.filelist.fonts, DIST_PRODUCT_FONT_DIR);
  copyImg(DIST_PRODUCT_IMG_DIR);
  copyTask(WORK_SRC +'index.html', DIST_PRODUCT_BASE_DIR);
  cb();
}

module.exports = {
  copyDev,
  copyProd,
  copyImg
};
