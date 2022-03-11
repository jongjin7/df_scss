const pkg = require('../package.json');

const cfg = {
  "paths": {
    "work_src": "./src/",
    "src": {
      "css": "assets/css/",
      "fonts": "assets/fonts/",
      "js": "assets/js/",
      "img": "assets/images/",
      "scss": "assets/scss/",
      "html": "pages/",
    },
    "dist_mode": {
      "dev": "./dist/dev/",
      "product": "./dist/prd/"
    },
    "build": {
      "base": "./build_temporary/",
      "js": "./build_temporary/assets/js/",
      "img": "./build_temporary/assets/img/"
    },
    "start_serve_html": "index.html"
  },
  "filelist": {
    "vendorCss": [
      "./src/assets/vendors/css/**",
      "./node_modules/bootstrap/dist/css/bootstrap.min.css"
    ],
    "workScss": [
      "./src/assets/scss/common.scss",
      "./src/assets/scss/app.scss"
    ],
    "vendorJs": [
      "./src/assets/vendors/js/modernizr-custom.js",
      "./src/assets/vendors/js/detectizr.js",
      "./node_modules/jquery/dist/jquery.min.js",
      "./node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"
    ],
    "commonJs": [
      "./src/assets/js/interactive/app.js",
      "./src/assets/js/debugger/css.debugger.js",
      "./src/assets/js/frame/GlobalVars.js",
      "./src/assets/js/frame/util.main.js",
    ],
    "contentJs":[
      "./src/assets/js/interactive/sample1.js",
      "./src/assets/js/interactive/sample2.js"
    ],

    "buildCommonJs": [
      "./build_temporary/assets/js/GlobalVars.js",
      "./build_temporary/assets/js/common.js"
    ],
    "fonts": [
      "./src/assets/fonts/*.{woff,woff2}"
    ],
    "imgs": [
      "./src/assets/images/**/**/*.{png,jpg,jpeg,gif,svg}"
    ],
    "html": [
      "./src/pages/**/**/*.html"
    ]
  },
  "urls": {
    "live": "http://live.sitename.com/",
    "dev": "http://dev.sitename.com/",
    "critical": "http://sitename.com/"
  },
  "buildFileNames": {
    "aliasKeyword": pkg.copyright,
    "siteVendorsCssName": "vendors.css",
    "siteVendorsJsName": "vendors.js",
    "siteCommonJsName": "common.js",
  },
  "gulp": {
    "port": 2020
  },
}

module.exports = {
  cfg
};
