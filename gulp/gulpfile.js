const pkg = require("./package.json");
const path = require("path");
const gulp = require('gulp');
const del = require('del');

const webpack = require('webpack');
const named = require('vinyl-named');
const through = require('through2');
const webpackStream = require('webpack-stream');
const webpackConfig = require(path.resolve(__dirname, 'webpack.config.js'));
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const $ = require("gulp-load-plugins")({
    pattern: ["*"],
    scope: ["devDependencies"]
});

const onError = (err) => console.log(err);

const banner = [
    "/**",
    " * @project        <%= pkg.name %>",
    " * @author         <%= pkg.author %>",
    " * @build          " + $.moment().format("llll") + " ET",
    " * @copyright      Copyright (c) " + $.moment().format("YYYY") + ", <%= pkg.copyright %>",
    " */",
    ""
].join("\n");

// Constant : Simple Path
const BUILD_VENDOR_JS_NAME = pkg.paths.build.js + pkg.varsFileNames.siteVendorsJsName;
const BUILD_VENDOR_CSS_NAME = pkg.paths.build.css + pkg.varsFileNames.siteVendorsCssName;

const DIST_PRODUCT_BASE_DIR = pkg.paths.dist_mode.product + pkg.paths.dist.base;
const DIST_PRODUCT_JS_DIR = pkg.paths.dist_mode.product + pkg.paths.dist.js;
const DIST_PRODUCT_CSS_DIR = pkg.paths.dist_mode.product + pkg.paths.dist.css;
const DIST_PRODUCT_IMG_DIR = pkg.paths.dist_mode.product + pkg.paths.dist.img;
const DIST_PRODUCT_FONT_DIR = pkg.paths.dist_mode.product + pkg.paths.dist.fonts;
const DIST_PRODUCT_FAVICON_DIR = pkg.paths.dist_mode.product + pkg.paths.dist.favicon;

const DIST_DEV_BASE_DIR = pkg.paths.dist_mode.dev + pkg.paths.dist.base;
const DIST_DEV_JS_DIR = pkg.paths.dist_mode.dev + pkg.paths.dist.js;
const DIST_DEV_CSS_DIR = pkg.paths.dist_mode.dev + pkg.paths.dist.css;
const DIST_DEV_IMG_DIR = pkg.paths.dist_mode.dev + pkg.paths.dist.img;
const DIST_DEV_FONT_DIR = pkg.paths.dist_mode.dev + pkg.paths.dist.fonts;

// 기타 상수
const MODE_DEV = 'dev';
const MODE_PRD = 'prd';

// ---------------------------------------------------------------------
// | JS tasks
// ---------------------------------------------------------------------

// 번들링
const webpackPluginDev =[];
const webpackPluginPrd = [
    new UglifyJSPlugin({
        uglifyOptions: {
            compress: {
                drop_console: true
            },
            output: {
                comments: false
            }
        },
    })
]

function bundlingWebpack($source_path, $target_path, $mode){
    $.fancyLog("-> webpackStream");
    return function() {
        gulp.src(['./build/assets/js/index.js','./build/assets/js/sub.js'])
            .pipe(named())
            .pipe(webpackStream({
                devtool: $mode == 'dev'? 'inline-source' : '',
                mode: $mode == 'dev'? 'development':'production',
                plugins: $mode == 'dev'? webpackPluginDev : webpackPluginPrd
            }))
            //.pipe(webpackStream(webpackConfig, webpack)) // 방법2
            //.pipe($.sourcemaps.init({loadMaps: true}))
            // .pipe(through.obj(function (file, enc, cb) {
            //     //Dont pipe through any source map files as it will be handled
            //     //by gulp-sourcemaps
            //     let isSourceMap = /\.map$/.test(file.path);
            //     if (!isSourceMap) this.push(file);
            //     cb();
            // }))
            //.pipe($.sourcemaps.write('./'))
            .pipe($.size({gzip: true, showFiles: true}))
            .pipe(gulp.dest($target_path));
    }
}

// 바벨 js 작업 - 자바스크립트를 빌드 폴더로 트랜스파일 합니다
function jsBabel($source_path, $target_path) {
    $.fancyLog("-> Transpiling Javascript via Babel...");
    return function () {
        gulp.src($source_path)
            .pipe($.plumber({errorHandler: onError}))
            .pipe($.newer({dest: pkg.paths.build.js}))
            .pipe($.sourcemaps.init({loadMaps: true}))
            .pipe($.babel({
                presets: ['@babel/preset-env']
            }))
            .pipe($.sourcemaps.write("./"))
            .pipe($.size({gzip: true, showFiles: true}))
            .pipe(gulp.dest($target_path));
    }
}

function build_js($source_path, $target_path, $mode) {
    return function () {
        $.fancyLog("-> Building js", $source_path, $target_path);

        if($mode == 'dev'){
            gulp.src($source_path)
                .pipe($.plumber({errorHandler: onError}))
                .pipe($.newer({dest: $target_path}))
                .pipe(gulp.dest($target_path))
                .pipe($.livereload());
        }else if($mode == 'prd'){
            gulp.src($source_path)
                .pipe($.plumber({errorHandler: onError}))
                //.pipe($.if(["*.js", "!*.min.js"],
                //  task...
                //))
                .pipe($.newer({dest: $target_path}))
                .pipe($.uglify())
                .pipe($.header(banner, {pkg: pkg}))
                .pipe($.size({gzip: true, showFiles: true}))
                .pipe(gulp.dest($target_path))
                .pipe($.filter("**/*.js"))
        }

    }
}

function concat_js($source_path, $target_path, $concat_name) {
    $.fancyLog("-> Concat js", $source_path);
    return function () {
        gulp.src($source_path)
            .pipe($.plumber({errorHandler: onError}))
            //.pipe($.newer({dest: $target_path, ext: ".min.js"})) //newer는 정리 필요
            .pipe($.sourcemaps.init({loadMaps: true}))
            .pipe($.concat($concat_name))
            .pipe($.sourcemaps.write("./"))
            //.pipe($.rename({suffix: ".min"}))
            .pipe(gulp.dest($target_path))
    }
}

//공통, 벤더용 JS합치기
gulp.task('js:vendor:concat', concat_js(pkg.globs.vendorJs, pkg.paths.build.js, pkg.varsFileNames.siteVendorsJsName));


//개발버전
gulp.task('js:babel:dev', jsBabel(pkg.globs.babelJs, DIST_DEV_JS_DIR));
gulp.task('js:bundle-webpack:dev',[], bundlingWebpack(pkg.globs.babelJs, DIST_DEV_JS_DIR, MODE_DEV))
gulp.task('js:bundle:dev', ['js:vendor:concat', 'js:babel:dev', 'js:bundle-webpack:dev'], build_js(BUILD_VENDOR_JS_NAME, DIST_DEV_JS_DIR)); // 번들링 적용
gulp.task('js:dev', ['js:vendor:concat', 'js:babel:dev'], build_js(pkg.paths.build.js + '*', DIST_DEV_JS_DIR, MODE_DEV)); //개발버전

//배포버전
gulp.task('js:babel:prd', jsBabel(pkg.globs.babelJs, pkg.paths.build.js));
gulp.task('js:bundle-webpack:prd',[], bundlingWebpack(pkg.globs.babelJs, DIST_PRODUCT_JS_DIR, MODE_PRD))
gulp.task('js:bundle:dev', ['js:vendor:concat', 'js:babel:prd', 'js:bundle-webpack:prd'], build_js(BUILD_VENDOR_JS_NAME, DIST_PRODUCT_JS_DIR)); // 번들링 적용
gulp.task('js:prd', ['js:vendor:concat', 'js:babel:prd'], build_js(pkg.paths.build.js +'*.js', DIST_PRODUCT_JS_DIR, MODE_PRD));


// ---------------------------------------------------------------------
// | SCSS,CSS tasks
// ---------------------------------------------------------------------

function cssConcat($target_path){
    return function () {
        $.fancyLog("-> CSS Concat");
        let ARR_Css_File = [];
        let ARR_Map_File = [];
        for (const val of pkg.globs.vendorCss) {
            if(val.indexOf('.map') > 0){
                ARR_Map_File.push(val);
            }else{
                ARR_Css_File.push(val);
            }
        }
        // css file
        gulp.src(ARR_Css_File)
            .pipe($.plumber({errorHandler: onError}))
            .pipe($.sourcemaps.init({loadMaps: true}))
            .pipe($.concat(pkg.varsFileNames.siteVendorsCssName))
            .pipe($.sourcemaps.write("./"))
            .pipe(gulp.dest($target_path))
        // map file
        // gulp.src(ARR_Map_File)
        //     .pipe($.plumber({errorHandler: onError}))
        //     .pipe($.concat(pkg.varsFileNames.siteVendorsCssName + '.map'))
        //     .pipe(gulp.dest($target_path))
    }
}

function css_optimize($target_path, $type) {
    return function () {
        if ($type == "vendor") {
            $.fancyLog("-> Optimize vendorCSS");
            let ARR_Css_File = [];
            for (const val of pkg.globs.vendorCss) {
                if(val.indexOf('.map') == -1){
                    ARR_Css_File.push(val);
                }
            }
            gulp.src(ARR_Css_File)
                .pipe($.plumber({errorHandler: onError}))
                .pipe($.concat(pkg.varsFileNames.siteVendorsCssName))
                // .pipe($.newer({dest: $target_path + pkg.varsFileNames.siteVendorsCssName}))
                // .pipe($.print())
                .pipe($.cssReplaceUrl({
                    //prepend: '/image_directory/', //프리픽스 경로 추가
                    //prependRelative: '/image_directory/', // 절대 경로로 교체
                    //replace: ['/webfonts/', '/fonts/'], //경로 교체
                    append: '?v=' + new Date().getTime(),
                }))
                .pipe($.cssmin())
                .pipe($.header(banner, {pkg: pkg}))
                .pipe($.size({gzip: true, showFiles: true}))
                .pipe(gulp.dest($target_path))
                .pipe($.filter("**/*.css"));
        } else if ($type == undefined) {
            $.fancyLog("-> CSS Optimize normal", pkg.globs.distPrdCss);
            gulp.src(pkg.globs.distPrdCss)
                .pipe($.plumber({errorHandler: onError}))
                .pipe($.cssReplaceUrl({
                    //prepend: '/image_directory/', //프리픽스 경로 추가
                    // prependRelative: '/image_directory/', // 절대 경로로 교체
                    //replace:  ['/fonts/','/woofonts/'], //경로 교체
                    append: '?v=' + new Date().getTime(),
                }))
                .pipe($.cssmin())
                .pipe($.header(banner, {pkg: pkg}))
                .pipe($.size({gzip: true, showFiles: true}))
                .pipe(gulp.dest($target_path))
                .pipe($.filter("**/*.css"));
        } else {
            console.log('잘못된 정의입니다.')
        }
    }
}

gulp.task("scss:prd", () => {
    $.fancyLog("-> Transpiling product scss");
    let ARR_SCSSFile = [];
    for (const val of pkg.globs.workScss) {
        ARR_SCSSFile.push(val);
    }

    return gulp.src(ARR_SCSSFile)
        .pipe($.sass({
            includePaths: pkg.paths.scss
        }).on("error", $.sass.logError))
        .pipe($.autoprefixer())
        .pipe(gulp.dest(DIST_PRODUCT_CSS_DIR));
});


gulp.task("scss:dev", () => {
    $.fancyLog("-> Transpiling dev scss");
    let ARR_SCSSFile = [];
    for (const val of pkg.globs.workScss) {
        ARR_SCSSFile.push(val);
    }

    return gulp.src(ARR_SCSSFile)
        .pipe($.plumber({errorHandler: onError}))
        .pipe($.sourcemaps.init({loadMaps: true}))
        .pipe($.sass({
            includePaths: pkg.paths.scss
        }).on("error", $.sass.logError))
        .pipe($.cached("sass_compile"))
        .pipe($.sourcemaps.write("./"))
        .pipe(gulp.dest(DIST_DEV_CSS_DIR))
        .pipe($.livereload());
});


//개발버전
gulp.task("css:vendor:dev", cssConcat(DIST_DEV_CSS_DIR,'vendor'));
gulp.task("css:dev", ["css:vendor:dev", "scss:dev"]); //개발버전

//배포버전
gulp.task("css:vendor:prd", css_optimize(DIST_PRODUCT_CSS_DIR, 'vendor'));
gulp.task("css:prd", ["scss:prd", "css:vendor:prd"], css_optimize(DIST_PRODUCT_CSS_DIR)); //배포버전


// ---------------------------------------------------------------------
// | image,font,favicon tasks
// ---------------------------------------------------------------------

// 파비콘 생성 작업
gulp.task("favicons-generate", () => {
    $.fancyLog("-> Generating favicons");
    return gulp.src(pkg.paths.src.favicon + "favicon.png")
        .pipe($.favicons({
            appName: pkg.name,
            appDescription: pkg.description,
            developerName: pkg.author,
            developerURL: pkg.urls.live,
            background: "#FFFFFF",
            path: pkg.paths.favicon,
            url: '',
            display: "standalone",
            orientation: "portrait",
            version: pkg.version,
            logging: false,
            online: false,
            html: pkg.paths.build.html + "favicons.html",
            replace: true,
            icons: {
                android: false, // 안드로이드 홈스크린 아이콘 생성. 불리언
                appleIcon: true, // 애플 터치 아이콘 생성. 불리언
                appleStartup: false, // 에플 시작 이미지 생성. 불리언
                coast: true, // 오페라 Coast 아이콘 생성. 불리언
                favicons: false, // 기본 파비콘 생성. 불리언
                firefox: true, // 파이어폭스 운영체제 아이콘 생성. 불리언
                opengraph: false, // 페이스북 오픈 그래프 이미지 생성. 불리언
                twitter: false, // 트위터 써머리 카드 이미지 생성. 불리언
                windows: true, // 윈도우즈 8 타이틀 아이콘 생성. 불리언
                yandex: true // Yandex 브라우져 아이콘 생성. 불리언
            }
        }))
        .pipe(gulp.dest(DIST_PRODUCT_FAVICON_DIR));
});

// 파비콘 복사 태스크
gulp.task("favicons", ["favicons-generate"]);


// 서체 복사 태스크
function copy_fonts($target_path) {
    return function () {
        gulp.src(pkg.globs.fonts)
            .pipe(gulp.dest($target_path));
    }
}

gulp.task('fonts:dev', copy_fonts(DIST_DEV_FONT_DIR)) //개발버전
gulp.task('fonts:prd', copy_fonts(DIST_PRODUCT_FONT_DIR)) //배포버전


// image 태스크
function copy_images($target_path) {
    return function () {
        gulp.src(pkg.paths.src.img + "**/**/*.{png,jpg,jpeg,gif,svg}")
            .pipe($.image()) //이미지 최적화
            .pipe(gulp.dest($target_path));
    }
}

gulp.task('images:dev', copy_images(DIST_DEV_IMG_DIR)) //개발버전
gulp.task('images:prd', copy_images(DIST_PRODUCT_IMG_DIR)) //배포버전


//HTML 템플릿 태스크
function html_generate($target_path, $type) {
    return function () {
        //console.log(pkg.globs.html[0])
        for (let i = 0, arr_html = pkg.globs.html; i < arr_html.length; i++) {
            //console.log('html:::', arr_html[i])
            $.fancyLog("-> Generate Html");
            gulp.src(arr_html[i].source)
            //mozilla nunjucksRender
                .pipe($.nunjucksRender({
                    envOptions: {
                        autoescape: false
                    },
                    //manageEnv: manageEnvironment,
                    path: [
                        './src/templates'
                    ]
                }))
                .on('error', function (e) {
                    console.log(e);
                    this.emit('end');
                })
                //.pipe($.plumber({errorHandler: onError}))
                //.pipe($.templateHtml(arr_html[i].template))
                .pipe($.prettyHtml())
                .pipe(gulp.dest($target_path + arr_html[i].target))
                .pipe($.livereload());
        }
    }
}

gulp.task('html:dev', html_generate(DIST_DEV_BASE_DIR, 'dev')) //개발버전
gulp.task('html:prd', html_generate(DIST_PRODUCT_BASE_DIR, 'prd')) //배포버전


// ---------------------------------------------------------------------
// | Main tasks
// ---------------------------------------------------------------------

gulp.task('watch', function () {
    $.livereload.listen();
    gulp.watch([pkg.paths.src.scss + "**/**/**/**/*.scss"], ["scss:dev"]);
    gulp.watch([pkg.paths.src.css + "**/*.css"], ["css"]);
    gulp.watch([pkg.paths.src.js + "**/*.js"], ["js:babel:dev"]);
    gulp.watch([pkg.paths.src.base + "**/**/*.html"], ["html:dev"]);
});

gulp.task('browser-sync', function () {
    $.browserSync.init({
        server: {
            baseDir: './dist/dev'
        },
        startPath: 'main.html'
        //startPath: './markup_template/tnk_table.html'
        //startPath: './markup_template/tml_button.html'
        //startPath: './markup_template/tml_form.html'
        //startPath: './markup_template/card_type_layout.html'
        //startPath: 'markup_template/basic_layout.html'
    });
});


// Clean Source
gulp.task('clean:dev', function() {
    return del('./dist/dev');
});

gulp.task('clean:prd', function() {
    return del('./dist/prd');
});

gulp.task('clean', function() {
    return del(['./build', './dist']);
});

// 프로덕션 빌드
gulp.task("build", ['css:prd', 'js:prd',   /*'images:prd', 'fonts:prd', */ 'html:prd']);

// 기본 작업(개발버전)
gulp.task("default", ['css:dev', 'js:dev', /*'images:dev', 'fonts:dev', */ 'html:dev', 'watch', 'browser-sync']);