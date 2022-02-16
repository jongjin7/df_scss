const { cfg } = require('./config');

const MODE_DEV = 'dev';
const MODE_PRD = 'prd';

// Constant : Simple Path
const WORK_SRC = cfg.paths.work_src;

const DIST_PRODUCT_BASE_DIR = cfg.paths.dist_mode.product;
const DIST_PRODUCT_HTML_DIR = cfg.paths.dist_mode.product + cfg.paths.src.html;
const DIST_PRODUCT_JS_DIR = cfg.paths.dist_mode.product + cfg.paths.src.js;
const DIST_PRODUCT_CSS_DIR = cfg.paths.dist_mode.product + cfg.paths.src.css;
const DIST_PRODUCT_IMG_DIR = cfg.paths.dist_mode.product + cfg.paths.src.img;
const DIST_PRODUCT_FONT_DIR = cfg.paths.dist_mode.product + cfg.paths.src.fonts;
const DIST_PRODUCT_FAVICON_DIR = cfg.paths.dist_mode.product + cfg.paths.src.favicon;

const DIST_DEV_BASE_DIR = cfg.paths.dist_mode.dev;
const DIST_DEV_HTML_DIR = cfg.paths.dist_mode.dev + cfg.paths.src.html;
const DIST_DEV_JS_DIR = cfg.paths.dist_mode.dev + cfg.paths.src.js;
const DIST_DEV_CSS_DIR = cfg.paths.dist_mode.dev + cfg.paths.src.css;
const DIST_DEV_IMG_DIR = cfg.paths.dist_mode.dev + cfg.paths.src.img;
const DIST_DEV_FONT_DIR = cfg.paths.dist_mode.dev + cfg.paths.src.fonts;


// 기타 상수
const IS_ALIAS_NAME = cfg.buildFileNames.aliasKeyword.length > 0 && cfg.buildFileNames.aliasKeyword != null;
const DIST_VENDORS_CSS_NAME = IS_ALIAS_NAME ? cfg.buildFileNames.aliasKeyword +'.'+ cfg.buildFileNames.siteVendorsCssName : cfg.buildFileNames.siteVendorsCssName;
const DIST_VENDORS_JS_NAME = IS_ALIAS_NAME ? cfg.buildFileNames.aliasKeyword +'.'+ cfg.buildFileNames.siteVendorsJsName : cfg.buildFileNames.siteVendorsJsName;
const DIST_COMMON_JS_NAME = IS_ALIAS_NAME ? cfg.buildFileNames.aliasKeyword +'.'+ cfg.buildFileNames.siteCommonJsName : cfg.buildFileNames.siteCommonJsName;

const BUILD_VENDOR_JS_NAME = [
  DIST_VENDORS_JS_NAME
];
const BUILD_COMMON_JS_NAME = [
  DIST_COMMON_JS_NAME
];

/////////////////////////////////////////////////////////////////////////////////////////
// ETC.

const ON_ERROR = (err) => console.log('Gulp Error Handler ==>',err);

const $ = require("gulp-load-plugins")({
  pattern: ["*"],
  scope: ["devDependencies"]
});

const BANNER_INFO = [
  "/**",
  " * @project        <%= pkg.name %>",
  " * @author         <%= pkg.author %>",
  " * @build          " + $.moment().format("llll") + " ET",
  " * @copyright      Copyright (c) " + $.moment().format("YYYY") + ", <%= pkg.copyright %>",
  " */",
  ""
].join("\n");



//////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports = {
  IS_ALIAS_NAME,
  WORK_SRC,

  DIST_PRODUCT_BASE_DIR,
  DIST_PRODUCT_HTML_DIR,
  DIST_PRODUCT_JS_DIR,
  DIST_PRODUCT_CSS_DIR,
  DIST_PRODUCT_IMG_DIR,
  DIST_PRODUCT_FONT_DIR,
  DIST_PRODUCT_FAVICON_DIR,

  DIST_DEV_BASE_DIR,
  DIST_DEV_HTML_DIR,
  DIST_DEV_JS_DIR,
  DIST_DEV_CSS_DIR,
  DIST_DEV_IMG_DIR,
  DIST_DEV_FONT_DIR,

  MODE_DEV,
  MODE_PRD,

  DIST_VENDORS_CSS_NAME,
  DIST_VENDORS_JS_NAME,
  DIST_COMMON_JS_NAME,

  BUILD_VENDOR_JS_NAME,
  BUILD_COMMON_JS_NAME,

  BANNER_INFO,
  $,
  ON_ERROR
}
