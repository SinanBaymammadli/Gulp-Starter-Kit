'use strict';

// Folder name Configurtions
var build = 'dist'; // build folder name
var workField = 'src'; // development folder name

// Dependecies
var gulp = require('gulp');

// Style Deps.
var autoprefixer = require('autoprefixer');
var csslint = require('gulp-csslint');
var cssmin = require('gulp-cssmin');
var postcss = require('gulp-postcss');
var rename = require('gulp-rename');
var cssnext = require('postcss-cssnext');
var precss = require('precss');

// Script Deps.
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var babel = require("gulp-babel");
var concat = require('gulp-concat');

//Image Deps.
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');

//Hmtl Deps.
var htmlmin = require('gulp-htmlmin');
var fileinclude = require('gulp-file-include');

// Browser-sync
var browserSync = require('browser-sync').create();


// Style Tasks
gulp.task('styles', function () {

	var processors = [
			precss({}),
			cssnext({}),
			autoprefixer({browsers: [
					'ie >= 10',
				    'ie_mob >= 10',
				    'ff >= 30',
				    'chrome >= 34',
				    'safari >= 7',
				    'opera >= 23',
				    'ios >= 7',
				    'android >= 4.4',
				    'bb >= 10'
				]})
		];

	gulp.src(workField +'/styles/main.css')
		.pipe(postcss(processors))
		.pipe(csslint())
    	.pipe(csslint.reporter())
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(build + '/styles'))
		.pipe(browserSync.stream()); //reload browser
	});

//Script Tasks
gulp.task('scripts', function() {
	gulp.src(workField +'/scripts/*.js')
		.pipe(babel())
		.pipe(concat('main.js'))
		.pipe(jshint())
    	.pipe(jshint.reporter('default'))
	    .pipe(uglify())
	    .pipe(rename({suffix: '.min'}))
	    .pipe(gulp.dest(build +'/scripts'))
	    .pipe(browserSync.stream()); //reload browser
	});


//Image Tasks
gulp.task('images', function() {
	gulp.src(workField +'/images/*')
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		}))
		.pipe(gulp.dest(build +'/images'))
		.pipe(browserSync.stream()); //reload browser
	});

//Html Tasks
gulp.task('html', function() {
	gulp.src(workField +'/html/*.html')
		.pipe(fileinclude({
	      prefix: '@@',
	      basepath: '@file'
	    }))
		.pipe(htmlmin({collapseWhitespace: true}))
		/*.pipe(rename({suffix: '.min'}))*/
		.pipe(gulp.dest(build +'/'))
		.pipe(browserSync.stream()); //reload browser
	});

//Copy
gulp.task('copy', function() {
	gulp.src(workField +'/*.*')
		.pipe(gulp.dest(build +'/'))
		.pipe(browserSync.stream()); //reload browser
	});


//Watch Task
gulp.task('serve', ['styles', 'scripts', 'images', 'html', 'copy'], function() {

    browserSync.init({
        server: "./dist",
        notify: false
    });

    // Watch tasks
	   // watching for styles
	   gulp.watch(workField +'/styles/**/*', ['styles']);

		// watching for scripts
		gulp.watch(workField +'/scripts/**/*', ['scripts']);

		// watching for images
		gulp.watch(workField +'/images/**/*', ['images']);

		// watching for html
		gulp.watch(workField +'/html/**/*', ['html']);

		// watching for copy
		gulp.watch(workField +'/*.*', ['copy']);
	});

//Default Task
gulp.task('default', ['serve']);
