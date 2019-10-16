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
const BUILD_VENDOR_JS_NAME = [
    pkg.paths.build.js + pkg.varsFileNames.siteVendorsJsName,
    pkg.paths.build.js + pkg.varsFileNames.siteVendorsJsName + '.map',
];
const BUILD_COMMON_JS_NAME = [
    pkg.paths.build.js + pkg.varsFileNames.siteCommonJsName,
    pkg.paths.build.js + pkg.varsFileNames.siteCommonJsName + '.map'
];
const BUILD_VENDOR_CSS_NAME = pkg.paths.build.css + pkg.varsFileNames.siteVendorsCssName;

const DIST_PRODUCT_BASE_DIR = pkg.paths.dist_mode.product + pkg.paths.dist.base;
const DIST_PRODUCT_HTML_DIR = pkg.paths.dist_mode.product + pkg.paths.dist.html;
const DIST_PRODUCT_SVG_ICON_DIR = pkg.paths.dist_mode.product + pkg.paths.dist.svg_icon;
const DIST_PRODUCT_JS_DIR = pkg.paths.dist_mode.product + pkg.paths.dist.js;
const DIST_PRODUCT_CSS_DIR = pkg.paths.dist_mode.product + pkg.paths.dist.css;
const DIST_PRODUCT_IMG_DIR = pkg.paths.dist_mode.product + pkg.paths.dist.img;
const DIST_PRODUCT_FONT_DIR = pkg.paths.dist_mode.product + pkg.paths.dist.fonts;
const DIST_PRODUCT_FAVICON_DIR = pkg.paths.dist_mode.product + pkg.paths.dist.favicon;

const DIST_DEV_BASE_DIR = pkg.paths.dist_mode.dev + pkg.paths.dist.base;
const DIST_DEV_HTML_DIR = pkg.paths.dist_mode.dev + pkg.paths.dist.html;
const DIST_DEV_SVG_ICON_DIR = pkg.paths.dist_mode.dev + pkg.paths.dist.svg_icon;
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

// 바벨 js 작업 - 자바스크립트를 빌드 폴더로 트랜스파일 합니다
function jsBabel($source_path, $target_path, $mode) {
    return function () {
        $.fancyLog("-> Transpiling Javascript via Babel...", $source_path, $target_path);
        if($mode == 'dev'){
            gulp.src($source_path)
                .pipe($.plumber({errorHandler: onError}))
                .pipe($.newer({dest: $target_path }))
                .pipe($.sourcemaps.init({loadMaps: true}))
                .pipe($.babel({
                    presets: ['@babel/preset-env']
                }))
                .pipe($.sourcemaps.write("./"))
                .pipe(gulp.dest($target_path))
                .pipe($.livereload({stream:true}));
        }else if($mode == 'prd'){
            gulp.src($source_path)
                .pipe($.babel({
                    presets: ['@babel/preset-env']
                }))
                .pipe($.size({gzip: true, showFiles: true}))
                .pipe(gulp.dest($target_path));
        }

    }
}

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



function createComponentList($source_path, $mode){
    return function () {
        let ArrTaskJsDir = [];
        let ArrTaskJsDirName = []
        var targetDir = './src/assets/js/interactive/components';
        let ArrSubDirs = fs.readdirSync($source_path)


        for(let i=0; i< ArrSubDirs.length; i++){
            if(!(/\.js/).test(ArrSubDirs)) {
                //console.log('path', $source_path +'/'+ ArrSubDirs[i]+'/*.js', ArrSubDirs[i].replace('component_',''))
                ArrTaskJsDirName.push(ArrSubDirs[i]);
                ArrTaskJsDir.push($source_path +'/'+ ArrSubDirs[i] +'/*.js')

                //ArrUseJsDir[ArrSubDirs[i]] = [];

                // let childDir = targetDir + '/' + ArrSubDirs[i];
                //
                // let childArrDir = fs.readdirSync(childDir)
                // for (let j = 0; j < childArrDir.length; j++) {
                //         ArrUseJsDir[ArrSubDirs[i]].push(childArrDir[j])
                // }
            }


        }

        for(let k = 0; k < ArrTaskJsDir.length; k++){
            concat_js(ArrTaskJsDir[k], pkg.paths.build.js, ArrTaskJsDirName[k], $mode)
        }


    }
}

//gulp.task('js:concat-component:dev', createComponentList(pkg.globs.componentsJs, MODE_DEV));

//개발버전
gulp.task('js:concat-vendor:dev', concat_js(pkg.globs.vendorJs, pkg.paths.build.js, pkg.varsFileNames.siteVendorsJsName, MODE_DEV));
gulp.task('js:concat-common:dev', concat_js(pkg.globs.commonJs, pkg.paths.build.js, pkg.varsFileNames.siteCommonJsName, MODE_DEV));
let ArrComponentsSrc = [];
let ArrTaskConcatComponentsDev = [];
let ArrTaskConcatComponentsPrd = [];
let ArrComponentFileNames = [];

//Dynamic Components Task
for(let i=0; i < pkg.varsFileNames.siteComponentJsName.length; i++){
    ArrTaskConcatComponentsDev.push('js:concat-components-'+i+':dev');
    ArrTaskConcatComponentsPrd.push('js:concat-components-'+i+':prd');
    ArrComponentsSrc.push(pkg.paths.src.js + 'interactive/components/' + pkg.varsFileNames.siteComponentJsName[i].replace(/\./g,'_').replace('sdp','component') +'/*.js')
    ArrComponentFileNames.push(pkg.varsFileNames.siteComponentJsName[i]+'.js');
    //console.log('src', ArrComponentsSrc)
    gulp.task(ArrTaskConcatComponentsDev[i], concat_js(ArrComponentsSrc[i], pkg.paths.build.js, ArrComponentFileNames[i], MODE_DEV));
    gulp.task(ArrTaskConcatComponentsPrd[i], concat_js(ArrComponentsSrc[i], pkg.paths.build.js, ArrComponentFileNames[i], MODE_PRD));
}

function ToBuildComponent($sourceFiles){
    let tmpArr =[];
    for(let i=0; i<$sourceFiles.length; i++){
        tmpArr.push(pkg.paths.build.js + $sourceFiles[i]);
        tmpArr.push(pkg.paths.build.js + $sourceFiles[i]+'.map');
    }
    return tmpArr;
}
gulp.task('js:build-common:dev',['js:concat-common:dev'], build_js(BUILD_COMMON_JS_NAME, DIST_DEV_JS_DIR, MODE_DEV));
gulp.task('js:build-components:dev', ArrTaskConcatComponentsDev , build_js(ToBuildComponent(ArrComponentFileNames), DIST_DEV_JS_DIR, MODE_DEV));
gulp.task('js:dev', ['js:concat-vendor:dev', 'js:build-common:dev', 'js:build-components:dev'], build_js(BUILD_VENDOR_JS_NAME, DIST_DEV_JS_DIR, MODE_DEV)); //개발버전

//배포버전
gulp.task('js:concat-vendor:prd', concat_js(pkg.globs.vendorJs, pkg.paths.build.js, pkg.varsFileNames.siteVendorsJsName, MODE_PRD));
gulp.task('js:concat-common:prd', concat_js(pkg.globs.commonJs, pkg.paths.build.js, pkg.varsFileNames.siteCommonJsName, MODE_PRD));
gulp.task('js:concat-components:prd', ArrTaskConcatComponentsPrd);
gulp.task('js:concat:prd',['js:concat-vendor:prd', 'js:concat-common:prd', 'js:concat-components:prd']);
//gulp.task('js:prd', [ 'js:concat:prd'], build_js(pkg.paths.build.js+'*.js', DIST_PRODUCT_JS_DIR, MODE_PRD)); //배포버전
gulp.task('js:build-vendors:prd', build_js(pkg.paths.build.js+'sdp.vendors.js', DIST_PRODUCT_JS_DIR, MODE_PRD));
gulp.task('js:copy-app:prd',['js:concat:prd'], function () {
    setTimeout(()=> {
        return gulp.src([pkg.paths.build.js+'*.js','!' + pkg.paths.build.js+'sdp.vendors.js'])
            .pipe(gulp.dest(DIST_PRODUCT_JS_DIR));
    },10000)
});
gulp.task('js:prd', [ 'js:build-vendors:prd', 'js:copy-app:prd' ]); //배포버전


// Discourse용 header/footer 배포
gulp.task('js:concat-common-discourse:prd', concat_js(pkg.globs.commonDiscourseJs, pkg.paths.build.js, pkg.varsFileNames.siteDiscourseJsName, MODE_PRD));

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
    console.log('$type', $target_path, $type)
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
            $.fancyLog("-> CSS Optimize normal", DIST_PRODUCT_CSS_DIR + '*.css');
            gulp.src([
                    DIST_PRODUCT_CSS_DIR + '*.css',
                    '!'+ DIST_PRODUCT_CSS_DIR + pkg.varsFileNames.siteVendorsCssName
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

// none compress version
// gulp.task("scss:prd", () => {
//     $.fancyLog("-> Transpilling dev scss");
//     let ARR_SCSSFile = [];
//     for (const val of pkg.globs.workScss) {
//         ARR_SCSSFile.push(val);
//     }
//
//     return gulp.src(ARR_SCSSFile)
//         .pipe($.sourcemaps.init({loadMaps: true}))
//         .pipe($.sass({
//             includePaths: pkg.paths.scss
//         }).on("error", $.sass.logError))
//         .pipe($.autoprefixer())
//         .pipe($.sourcemaps.write("./"))
//         .pipe(gulp.dest(DIST_PRODUCT_CSS_DIR));
// });

gulp.task("scss:dev", () => {
    $.fancyLog("-> Transpilling dev scss");
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
//gulp.task("css:prd", ["scss:prd", "css:vendor:prd"], css_optimize(DIST_PRODUCT_CSS_DIR)); //배포버전
gulp.task("css:prd", ["scss:prd", "css:vendor:prd"]); //배포버전


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


// 서체 및 기타 복사 태스크
function copyTesk($target_src, $target_path) {
    return function () {
        gulp.src($target_src)
            .pipe(gulp.dest($target_path));
    }
}

gulp.task('fonts:dev', copyTesk(pkg.globs.fonts, DIST_DEV_FONT_DIR)) //개발버전
gulp.task('fonts:prd', copyTesk(pkg.globs.fonts, DIST_PRODUCT_FONT_DIR)) //배포버전


// image 태스크
function copy_images($target_path) {
    return function () {
        gulp.src(pkg.paths.src.img + "**/**/*.{png,jpg,jpeg,gif,svg}")
            //.pipe($.image()) //이미지 최적화
            .pipe(gulp.dest($target_path));
    }
}

// 이미지 복사
gulp.task('images:dev', copy_images(DIST_DEV_IMG_DIR)) //개발버전
gulp.task('images:prd', copy_images(DIST_PRODUCT_IMG_DIR)) //배포버전

//HTML 템플릿 태스크
function html_generate($target_path, $type) {
    return function () {
        //for (let i = 0, arr_html = pkg.globs.html; i < arr_html.length; i++) {
            $.fancyLog("-> Generate Html");
            gulp.src(pkg.globs.html)
                //.pipe($.ignore.exclude('./src/html/inc/*.html'))
                //mozilla nunjucksRender
                .pipe($.newer({dest: $target_path, ext: ".html"}))
                .pipe($.nunjucksRender({
                    envOptions: {
                        autoescape: false
                    },
                    //manageEnv: manageEnvironment,
                    path: [
                        './src/html/inc'
                    ]
                }))
                .on('error', function (e) {
                    console.log(e);
                    this.emit('end');
                })
                .pipe($.prettyHtml())
                .pipe(gulp.dest($target_path +'/html'))
                //.pipe($.livereload({stream:true}));
        //}
    }
}

gulp.task('html:dev', html_generate(DIST_DEV_BASE_DIR, 'dev')) //개발버전
gulp.task('html:prd', html_generate(DIST_PRODUCT_HTML_DIR, 'prd')) //배포버전


gulp.task('index:dev', copyTesk(pkg.paths.src.base +'index.html', DIST_DEV_BASE_DIR)) //개발버전
gulp.task('index:prd', copyTesk(pkg.paths.src.base +'index.html', DIST_PRODUCT_BASE_DIR)) //배포버전

gulp.task('email:dev', copyTesk(pkg.globs.onlyCopyEmail, DIST_DEV_BASE_DIR + '/email_template/')) //개발버전
gulp.task('email:prd', copyTesk(pkg.globs.onlyCopyEmail, DIST_PRODUCT_BASE_DIR + '/email_template/')) //배포버전

// ---------------------------------------------------------------------
// | 기타 번들 리소스
// ---------------------------------------------------------------------

// 기타 번들 복사/ highlight
gulp.task('js:copy:dev', copyTesk(pkg.globs.onlyCopyJs, DIST_DEV_JS_DIR)) //개발버전
gulp.task('js:copy:prd', copyTesk(pkg.globs.onlyCopyJs, DIST_PRODUCT_JS_DIR)) //배포버전


// ---------------------------------------------------------------------
// | Main tasks
// ---------------------------------------------------------------------

gulp.task('watch', function () {
    $.livereload.listen();
    gulp.watch([pkg.paths.src.scss + "**/**/**/**/*.scss"], ["scss:dev"]);
    gulp.watch(pkg.paths.src.img + "**/**/*.{png,jpg,jpeg,gif,svg}", ["images:dev"]);
    gulp.watch(pkg.globs.commonJs, ["js:build-common:dev"]);
    gulp.watch(pkg.globs.componentsJs, ["js:build-components:dev"]);
    //gulp.watch([pkg.paths.src.js + "interactive/*.js"], ["js:babel:dev"]);
    gulp.watch(pkg.globs.html, ["html:dev"]);
});

gulp.task('browser-sync', function () {
    $.browserSync.init({
        server: {
            baseDir: './dist/dev',
        },
        port: 3880,
        browser: ['chrome'], //서버 실행시 띄우고자하는 브라우저 (firefox, opera)
        startPath: 'html/pages/index.html'
    });
});


// Clean Source
gulp.task('clean:build', function() {
    $.fancyLog("-> remove build")
    return del('./build_temporary');
});


gulp.task('clean', function() {
    return del(['./build_temporary', './dist']);
});

// 프로덕션 빌드
//gulp.task("build", ['css:prd', 'js:prd', 'js:copy:prd', 'images:prd', 'fonts:prd', 'html:prd', 'index:dev', 'email:prd']);
gulp.task("build", ['css:prd', 'js:prd', 'js:copy:prd', 'images:prd', 'fonts:prd', 'html:prd', 'index:prd', 'email:prd']);


// 기본 작업(개발버전)
gulp.task("default", ['watch', 'browser-sync', 'css:dev', 'js:dev', 'js:copy:dev', 'images:dev', 'fonts:dev',  'html:dev', 'index:dev', 'email:dev']);