var gulp = require('gulp'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync').create();

var DEST = 'res/';
gulp.task('del', function(){
    return gulp.src([
            DEST + 'js',
            DEST + 'css'
        ],{
            read:false
        })
        .pipe(clean());
});

gulp.task('js:copy', function(){
    return gulp.src([
            'src/js/app/*.js',
            'src/js/*.js',
        ])
        .pipe(gulp.dest(DEST+'/js'))
        .pipe(browserSync.stream());
});


gulp.task('js:compact-lib', function() {
    return gulp.src([
        'vendors/jquery/dist/jquery.min.js',
        'src/js/lib/modernizr.js',
        'src/js/lib/detectizr.js',
      ])
      .pipe(concat('common.js'))
      .pipe(gulp.dest(DEST+'/js'))
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(gulp.dest(DEST+'/js'))
      .pipe(browserSync.stream());
});

gulp.task('js:compact-vendors-charts', function() {
    return gulp.src([
        'vendors/chartJs_new/Chart.min.js',
        'vendors/echarts/dist/echarts.min.js',
        'vendors/gauge.js/dist/gauge.min.js',
    ])
        .pipe(concat('vendors.charts.js'))
        .pipe(gulp.dest(DEST+'/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(DEST+'/js'))
        .pipe(browserSync.stream());
});

gulp.task('js:compact-vendors-common', function() {
    return gulp.src([
        'vendors/bootstrap/dist/js/bootstrap.min.js',
        'vendors/nprogress/nprogress.js',
        'vendors/moment/min/moment.min.js',
        'vendors/bootstrap-daterangepicker/daterangepicker.js',
        'vendors/jquery.mCustomScrollbar/jquery.mCustomScrollbar.concat.min.js',
        'vendors/skycons/skycons.js',
        'vendors/validator-master/validator.js',
        'vendors/validator/multifield.js',
        'vendors/datatables/datatables.min.js',
    ])
        .pipe(concat('vendors.common.js'))
        .pipe(gulp.dest(DEST+'/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(DEST+'/js'))
        .pipe(browserSync.stream());
});

// TODO: Maybe we can simplify how sass compile the minify and unminify version
var compileSASS = function (filename, options) {
  return sass('src/scss/*.scss', options)
        .pipe(autoprefixer('last 2 versions', '> 5%'))
        .pipe(concat(filename))
        .on('error', sass.logError)
        // for inline sourcemaps
        .pipe(sourcemaps.write())
        // for file sourcemaps
        .pipe(sourcemaps.write('maps', {
          includeContent: false,
          sourceRoot: 'source'
        }))
        .pipe(gulp.dest(DEST+'/css'))
        .pipe(browserSync.stream());
};

gulp.task('sass', function() {
    return compileSASS('custom.css', {});
});

gulp.task('sass-minify', function() {
    return compileSASS('custom.min.css', {style: 'compressed', sourcemap:true});
});


var cssMinify = function (filename, options) {
    return gulp.src([
        'vendors/bootstrap/dist/css/bootstrap.min.css',
        'vendors/nprogress/nprogress.css',
        'vendors/jquery.mCustomScrollbar/jquery.mCustomScrollbar.css',
        'vendors/bootstrap-daterangepicker/daterangepicker.css'
    ], options)
        .pipe(autoprefixer('last 2 versions', '> 5%'))
        .pipe(concat(filename))
        .pipe(gulp.dest(DEST+'/css'))
};
gulp.task('vendors-css:minify', function() {
    return cssMinify('vendors.min.css');
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: './'
        },
        startPath: './index.html'
        //startPath: './markup_template/tnk_table.html'
        //startPath: './markup_template/tml_button.html'
        //startPath: './markup_template/tml_form.html'
        //startPath: './markup_template/card_type_layout.html'
        //startPath: 'markup_template/basic_layout.html'
    });
});


gulp.task('watch', function() {
  // Watch .html files
  gulp.watch('html/*.html', browserSync.reload);
  gulp.watch('html/**/*.html', browserSync.reload);
  gulp.watch('markup_template/*.html', browserSync.reload);
  // Watch .js files
  gulp.watch(['src/js/*.js', 'src/js/app/*.js'], ['js:copy']);
  // Watch .scss files
  gulp.watch('src/scss/*.scss', ['sass', 'sass-minify']);
});

gulp.task('build', ['js:compact-lib', 'js:compact-vendors-common','js:compact-vendors-charts', 'sass', 'sass-minify']);

// Default Task
gulp.task('default', ['build','watch','browser-sync']);