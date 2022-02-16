const pkg = require("./package.json");
const path = require("path");
const fs = require("fs")
const gulp = require('gulp');
const del = require('del');

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
const WORK_SRC = pkg.paths.work_src;

const DIST_PRODUCT_BASE_DIR = pkg.paths.dist_mode.product;
const DIST_PRODUCT_HTML_DIR = pkg.paths.dist_mode.product + pkg.paths.src.html;
const DIST_PRODUCT_JS_DIR = pkg.paths.dist_mode.product + pkg.paths.src.js;
const DIST_PRODUCT_CSS_DIR = pkg.paths.dist_mode.product + pkg.paths.src.css;
const DIST_PRODUCT_IMG_DIR = pkg.paths.dist_mode.product + pkg.paths.src.img;
const DIST_PRODUCT_FONT_DIR = pkg.paths.dist_mode.product + pkg.paths.src.fonts;
const DIST_PRODUCT_FAVICON_DIR = pkg.paths.dist_mode.product + pkg.paths.src.favicon;

const DIST_DEV_BASE_DIR = pkg.paths.dist_mode.dev;
const DIST_DEV_HTML_DIR = pkg.paths.dist_mode.dev + pkg.paths.src.html;
const DIST_DEV_JS_DIR = pkg.paths.dist_mode.dev + pkg.paths.src.js;
const DIST_DEV_CSS_DIR = pkg.paths.dist_mode.dev + pkg.paths.src.css;
const DIST_DEV_IMG_DIR = pkg.paths.dist_mode.dev + pkg.paths.src.img;
const DIST_DEV_FONT_DIR = pkg.paths.dist_mode.dev + pkg.paths.src.fonts;

// 기타 상수
const MODE_DEV = 'dev';
const MODE_PRD = 'prd';


const isAliasName = pkg.varsFileNames.aliasKeyword.length > 0 && pkg.varsFileNames.aliasKeyword != null;
const DIST_VENDORS_CSS_NAME = isAliasName ? pkg.varsFileNames.aliasKeyword +'.'+ pkg.varsFileNames.siteVendorsCssName : pkg.varsFileNames.siteVendorsCssName;
const DIST_VENDORS_JS_NAME = isAliasName ? pkg.varsFileNames.aliasKeyword +'.'+ pkg.varsFileNames.siteVendorsJsName : pkg.varsFileNames.siteVendorsJsName;
const DIST_COMMON_JS_NAME = isAliasName ? pkg.varsFileNames.aliasKeyword +'.'+ pkg.varsFileNames.siteCommonJsName : pkg.varsFileNames.siteCommonJsName;


const BUILD_VENDOR_JS_NAME = [
    pkg.paths.build.js + DIST_VENDORS_JS_NAME,
    pkg.paths.build.js + DIST_VENDORS_JS_NAME + '.map',
];
const BUILD_COMMON_JS_NAME = [
    pkg.paths.build.js + DIST_COMMON_JS_NAME,
    pkg.paths.build.js + DIST_COMMON_JS_NAME + '.map'
];
// ---------------------------------------------------------------------
// | JS tasks
// ---------------------------------------------------------------------

function build_js($source_path, $target_path, $mode) {
    return function () {
        $.fancyLog("-> Building js", $source_path, $target_path);

        if($mode == 'dev'){
            setTimeout(()=>{
                gulp.src($source_path)
                    .pipe($.plumber({errorHandler: onError}))
                    .pipe($.newer({dest: $target_path}))
                    .pipe(gulp.dest($target_path))
                    .pipe($.livereload({stream:true}));
            },500)
        }else if($mode == 'prd'){
            setTimeout(()=>{
                gulp.src($source_path)
                    .pipe($.uglify())
                    .pipe($.header(banner, {pkg: pkg}))
                    .pipe($.size({gzip: true, showFiles: true}))
                    .pipe(gulp.dest($target_path))
                //.pipe($.filter("**/*.js"))
            },2000)
        }

    }
}

function concat_js($source_path, $target_path, $concat_name, $mode, $file_type) {
    return function () {
        $.fancyLog("-> Concat js");
        if($mode == MODE_DEV){
            gulp.src($source_path)
                .pipe($.plumber({errorHandler: onError}))
                //.pipe($.newer({dest: $target_path, ext: ".min.js"}))
                .pipe($.sourcemaps.init({loadMaps: true}))
                .pipe($.concat($concat_name))
                .pipe($.sourcemaps.write("./"))
                //.pipe($.rename({suffix: ".min"}))
                .pipe(gulp.dest($target_path))

        }else if($mode == MODE_PRD){
            if($file_type == 'common') $source_path = [$source_path[0], $source_path[1]] //common파일일 경우 재정의
            gulp.src($source_path)
                .pipe($.concat($concat_name))
                //.pipe($.stripDebug()) //remove Strip console, alert, and debugger statements from JavaScript code with strip-debug
                .pipe(gulp.dest($target_path))
        }

    }
}

//Dynamic Modules Task
let ArrModulesSrc = [];
let ArrTaskConcatModulesDev = [];
let ArrTaskConcatModulesPrd = [];
let ArrModuleFileNames = [];

for(let i=0; i < pkg.varsFileNames.siteModuleJsName.length; i++){
    ArrTaskConcatModulesDev.push('js:concat-modules-'+i+':dev');
    ArrTaskConcatModulesPrd.push('js:concat-modules-'+i+':prd');
    ArrModulesSrc.push(pkg.filelist.moduleJs[i]);
    ArrModuleFileNames.push((isAliasName? pkg.varsFileNames.aliasKeyword +'.':'') + pkg.varsFileNames.siteModuleJsName[i]+'.js');
    //console.log('src', ArrModulesSrc)
    gulp.task(ArrTaskConcatModulesDev[i], concat_js(ArrModulesSrc[i], pkg.paths.build.js, ArrModuleFileNames[i], MODE_DEV));
    gulp.task(ArrTaskConcatModulesPrd[i], concat_js(ArrModulesSrc[i], pkg.paths.build.js, ArrModuleFileNames[i], MODE_PRD));
}

function ToBuildComponent($sourceFiles){
    let tmpArr =[];
    for(let i=0; i<$sourceFiles.length; i++){
        tmpArr.push(pkg.paths.build.js + $sourceFiles[i]);
        tmpArr.push(pkg.paths.build.js + $sourceFiles[i]+'.map');
    }
    return tmpArr;
}

//개발버전
gulp.task('js:concat-vendor:dev', concat_js(pkg.filelist.vendorJs, pkg.paths.build.js, DIST_VENDORS_JS_NAME, MODE_DEV));
gulp.task('js:concat-common:dev', concat_js(pkg.filelist.commonJs, pkg.paths.build.js, DIST_COMMON_JS_NAME, MODE_DEV));

gulp.task('js:build-common:dev',['js:concat-common:dev'], build_js(BUILD_COMMON_JS_NAME, DIST_DEV_JS_DIR, MODE_DEV));
gulp.task('js:build-modules:dev', ArrTaskConcatModulesDev , build_js(ToBuildComponent(ArrModuleFileNames), DIST_DEV_JS_DIR, MODE_DEV));
gulp.task('js:dev', ['js:concat-vendor:dev', 'js:build-common:dev', 'js:build-modules:dev'], build_js(BUILD_VENDOR_JS_NAME, DIST_DEV_JS_DIR, MODE_DEV)); //개발버전

//배포버전
gulp.task('js:concat-vendor:prd', concat_js(pkg.filelist.vendorJs, pkg.paths.build.js, DIST_VENDORS_JS_NAME, MODE_PRD));
gulp.task('js:concat-common:prd', concat_js(pkg.filelist.commonJs, pkg.paths.build.js, DIST_COMMON_JS_NAME, MODE_PRD));
gulp.task('js:concat-modules:prd', ArrTaskConcatModulesPrd);
gulp.task('js:concat:prd',['js:concat-vendor:prd', 'js:concat-common:prd', 'js:concat-modules:prd']);
//gulp.task('js:prd', [ 'js:concat:prd'], build_js(pkg.paths.build.js+'*.js', DIST_PRODUCT_JS_DIR, MODE_PRD)); //배포버전
gulp.task('js:build-vendors:prd', build_js(pkg.paths.build.js + DIST_VENDORS_JS_NAME, DIST_PRODUCT_JS_DIR, MODE_PRD));
gulp.task('js:copy-app:prd',['js:concat:prd'], function () {
    setTimeout(()=> {
        return gulp.src([
            pkg.paths.build.js+'*.js',
            '!' + pkg.paths.build.js + DIST_VENDORS_JS_NAME
        ])
            .pipe(gulp.dest(DIST_PRODUCT_JS_DIR));
    },10000)
});
gulp.task('js:prd', [ 'js:build-vendors:prd', 'js:copy-app:prd' ]); //배포버전


// ---------------------------------------------------------------------
// | SCSS,CSS tasks
// ---------------------------------------------------------------------

function cssConcat($target_path){
    return function () {
        $.fancyLog("-> CSS Concat");
        let ARR_Css_File = [];
        let ARR_Map_File = [];
        for (const val of pkg.filelist.vendorCss) {
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
            .pipe($.concat(DIST_VENDORS_CSS_NAME))
            .pipe($.sourcemaps.write("./"))
            .pipe(gulp.dest($target_path))
        // map file
        // gulp.src(ARR_Map_File)
        //     .pipe($.plumber({errorHandler: onError}))
        //     .pipe($.concat(DIST_VENDORS_CSS_NAME + '.map'))
        //     .pipe(gulp.dest($target_path))
    }
}

function css_optimize($target_path, $type) {
    return function () {
        if ($type == "vendor") {
            $.fancyLog("-> Optimize vendorCSS");
            let ARR_Css_File = [];
            for (const val of pkg.filelist.vendorCss) {
                if(val.indexOf('.map') == -1){
                    ARR_Css_File.push(val);
                }
            }
            gulp.src(ARR_Css_File)
                .pipe($.plumber({errorHandler: onError}))
                .pipe($.concat(DIST_VENDORS_CSS_NAME))
                // .pipe($.newer({dest: $target_path + DIST_VENDORS_CSS_NAME}))
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
            $.fancyLog("-> CSS Optimize normal", DIST_PRODUCT_CSS_DIR + '*.css');
            gulp.src([
                DIST_PRODUCT_CSS_DIR + '*.css',
                '!'+ DIST_PRODUCT_CSS_DIR + DIST_VENDORS_CSS_NAME
            ])
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

// compress version
gulp.task("scss:prd", () => {
    $.fancyLog("-> Transpilling product scss");
    let ARR_SCSSFile = [];
    for (const val of pkg.filelist.workScss) {
        ARR_SCSSFile.push(val);
    }

    return gulp.src(ARR_SCSSFile)
        .pipe($.sass({
            includePaths: pkg.paths.scss
        }).on("error", $.sass.logError))
        .pipe($.autoprefixer())
        .pipe($.rename(path =>{
            if(isAliasName){
                path.basename = pkg.varsFileNames.aliasKeyword +'.'+ path.basename
            }
        }))
        .pipe(gulp.dest(DIST_PRODUCT_CSS_DIR));
});

// no compress version
// gulp.task("scss:prd", () => {
//     $.fancyLog("-> Transpilling dev scss");
//     let ARR_SCSSFile = [];
//     for (const val of pkg.filelist.workScss) {
//         ARR_SCSSFile.push(val);
//     }
//
//     return gulp.src(ARR_SCSSFile)
//         .pipe($.sourcemaps.init({loadMaps: true}))
//         .pipe($.sass({
//             includePaths: pkg.paths.scss
//         }).on("error", $.sass.logError))
//         .pipe($.autoprefixer())
//         .pipe($.rename(path =>{
//             if(isAliasName){
//                 path.basename = pkg.varsFileNames.aliasKeyword +'.'+ path.basename
//             }
//         }))
//         .pipe($.sourcemaps.write("./"))
//         .pipe(gulp.dest(DIST_PRODUCT_CSS_DIR));
// });

gulp.task("scss:dev", () => {
    $.fancyLog("-> Transpilling dev scss");
    let ARR_SCSSFile = [];
    for (const val of pkg.filelist.workScss) {
        ARR_SCSSFile.push(val);
    }

    return gulp.src(ARR_SCSSFile)
        .pipe($.plumber({errorHandler: onError}))
        .pipe($.sourcemaps.init({loadMaps: true}))
        .pipe($.rename(path =>{
            if(isAliasName){
                path.basename = pkg.varsFileNames.aliasKeyword +'.'+ path.basename
            }
        }))
        .pipe($.sass({
            includePaths: pkg.paths.scss
        }).on("error", $.sass.logError))
        .pipe($.cached("sass_compile"))
        //.pipe($.autoprefixer())
        .pipe($.sourcemaps.write("./"))
        .pipe(gulp.dest(DIST_DEV_CSS_DIR))
        .pipe($.livereload({stream:true}));
});


//개발버전
gulp.task("css:vendor:dev", cssConcat(DIST_DEV_CSS_DIR,'vendor'));
gulp.task("css:dev", ["css:vendor:dev", "scss:dev"]); //개발버전

//배포버전
gulp.task("css:vendor:prd", css_optimize(DIST_PRODUCT_CSS_DIR, 'vendor'));
gulp.task("css:prd", ["scss:prd", "css:vendor:prd"]); //기본 배포버전
//gulp.task("css:prd", ["scss:prd", "css:vendor:prd"], css_optimize(DIST_PRODUCT_CSS_DIR)); //최종(압축) 배포버전

// ---------------------------------------------------------------------
// | image,font,favicon tasks
// ---------------------------------------------------------------------

function copyTesk($source_src, $target_path) {
    return function () {
        $.fancyLog('-> copy:', $source_src, $target_path)
        gulp.src($source_src)
            .pipe(gulp.dest($target_path));
    }
}

// 서체 및 기타 복사 태스크
gulp.task('fonts:dev', copyTesk(pkg.filelist.fonts, DIST_DEV_FONT_DIR)); //개발버전
gulp.task('fonts:prd', copyTesk(pkg.filelist.fonts, DIST_PRODUCT_FONT_DIR)); //배포버전

// 파비콘 복사
gulp.task('favicon:prd', copyTesk(WORK_SRC + pkg.paths.src.favicon + '*.{png,jpg,jpeg,gif,svg}', DIST_PRODUCT_FAVICON_DIR)) ;//배포버전


// 이미지 복사
function copy_images($target_path) {
    $.fancyLog('copy_images ->', $target_path, WORK_SRC + pkg.paths.src.img)
    return function () {
        gulp.src(WORK_SRC + pkg.paths.src.img + "**/**/*.{png,jpg,jpeg,gif,svg}")
            //.pipe($.image()) //이미지 최적화
            .pipe(gulp.dest($target_path));
    }
}

gulp.task('images:dev', copy_images(DIST_DEV_IMG_DIR)); //개발버전
gulp.task('images:prd', copy_images(DIST_PRODUCT_IMG_DIR)) ;//배포버전


//HTML 생성
function html_generate($target_path) {
    return function () {
        $.fancyLog("-> Generate Html", $target_path, pkg.filelist.html, pkg.varsFileNames.aliasKeyword);
        gulp.src(pkg.filelist.html)
            //.pipe($.ignore.exclude(WORK_SRC + 'inc/*.html'))
            //mozilla nunjucksRender

            .pipe($.newer({dest: $target_path, ext: ".html"}))
            .pipe($.nunjucksRender({
                envOptions: {
                    autoescape: false
                },
                //manageEnv: manageEnvironment,
                path: [
                    WORK_SRC + 'inc'
                ],
                // data: {
                //     prefix_name : isAliasName? pkg.varsFileNames.aliasKeyword +'.' :''
                // }
            }))
            .on('error', function (e) {
                console.log(e);
                this.emit('end');
            })
            .pipe($.prettyHtml())
            .pipe(gulp.dest($target_path))
    }
}

gulp.task('html:dev', html_generate(DIST_DEV_HTML_DIR)); //개발버전
gulp.task('html:prd', html_generate(DIST_PRODUCT_HTML_DIR)); //배포버전

// ---------------------------------------------------------------------
// | 페이지 암호 코드 HTML 생성
// ---------------------------------------------------------------------

var strPassCodeSS ='<?php\n' +
    'include ($_SERVER["DOCUMENT_ROOT"]."/test/ss-daily/access_chk.php");\n' +
    '?>';
var strPassCodeDF ='<?php\n' +
    'include ($_SERVER["DOCUMENT_ROOT"]."/test/ss-daily/access_chk2.php");\n' +
    '?>';

function html_generate_password($target_path, $cat) {
    return function () {
        $.fancyLog("-> Generate Password Html");
        gulp.src(pkg.filelist.html)
            .pipe($.newer({dest: $target_path, ext: ".html"}))
            .pipe($.nunjucksRender({
                envOptions: {
                    autoescape: false
                },
                path: [
                    WORK_SRC + 'inc'
                ],
                data: {
                    prefix_name : isAliasName? pkg.varsFileNames.aliasKeyword +'.' :''
                }
            }))
            .pipe($.injectString.prepend($cat == 'ss'? strPassCodeSS : strPassCodeDF))
            .on('error', function (e) {
                console.log(e);
                this.emit('end');
            })
            .pipe($.prettyHtml())
            .pipe(gulp.dest($target_path))
    }
}

//gulp.task('html:share-html-ss', html_generate_password('./dist/share_html_ss/', 'ss')) //삼성 배포버전
//gulp.task('html:share-html-df', html_generate_password('./dist/share_html_df/', 'df')) //DF 배포버전



// ---------------------------------------------------------------------
// | 기타 리소스 복사
// ---------------------------------------------------------------------
// 일반 HTML 복사
gulp.task('index:dev', copyTesk(WORK_SRC +'index.html', DIST_DEV_BASE_DIR)) //개발버전
gulp.task('index:prd', copyTesk(WORK_SRC +'index.html', DIST_PRODUCT_BASE_DIR)) //배포버전

// 테스트용 HTML 복사
// gulp.task('html:copy:only-test:dev', copyTesk(WORK_SRC + 'html/pages/@test_html/**/**/*', DIST_DEV_HTML_DIR + 'pages/@test_html')) //개발버전
// gulp.task('html:copy:only-test:prd', copyTesk(WORK_SRC + 'html/pages/@test_html/**/**/*', DIST_PRODUCT_HTML_DIR + 'pages/@test_html')) //개발버전
// gulp.task('html:copy:only-test:share', copyTesk(WORK_SRC + 'html/pages/@test_html/**/**/*', './dist/share_html/html/' + 'pages/@test_html')) //개발버전


// ---------------------------------------------------------------------
// | Main tasks
// ---------------------------------------------------------------------
gulp.task('watch', function () {
    $.livereload.listen();
    gulp.watch([WORK_SRC + pkg.paths.src.scss + "**/**/**/**/*.scss"], ["scss:dev"]);
    gulp.watch(WORK_SRC + pkg.paths.src.img + "**/**/*.{png,jpg,jpeg,gif,svg}", ["images:dev"]);
    gulp.watch(pkg.filelist.commonJs, ["js:build-common:dev"]);
    gulp.watch(pkg.filelist.moduleJs, ["js:build-modules:dev"]);
    gulp.watch(pkg.filelist.html, ["html:dev"]);
});

gulp.task('browser-sync', function () {
    $.browserSync.init({
        server: {
            baseDir: DIST_DEV_BASE_DIR,
        },
        port: pkg.gulp.port,
        browser: ['chrome'], //서버 실행시 띄우고자하는 브라우저 (firefox, opera)
        startPath: pkg.paths.start_serve_html
    });
});


// Clean Source
gulp.task('clean', function() {
    return del(['./build_temporary', './dist']);
});

// 프로덕션 빌드
gulp.task("build", ['css:prd', 'js:prd', 'images:prd', 'fonts:prd', 'html:prd', 'index:prd', 'favicon:prd']);


// 기본 작업(개발버전)
gulp.task("default", ['watch', 'browser-sync', 'css:dev', 'js:dev', 'images:dev', 'fonts:dev',  'html:dev', 'index:dev']);