'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var rimraf = require('rimraf');
var _ = require('lodash');

/**
 * Constants
 */

var target = 'qcode-decoder.min.js';

var paths = {
  scripts: ['src/**/*.js'],
  jsqrcode: _.map(["grid.js", "version.js", "detector.js", "formatinf.js",
             "errorlevel.js", "bitmat.js", "datablock.js","bmparser.js",
             "datamask.js","rsdecoder.js","gf256poly.js", "gf256.js",
             "decoder.js", "qrcode.js", "findpat.js", "alignpat.js",
             "databr.js"], function (file) {
              return 'vendor/' + file;
             }),
  build: ['build/js/*.js'],
  tests: ['test/**/*.js']
};

var dirs = {
  build: 'build',
  buildSrc: 'build/js'
};

/**
 * Building the jsqrcode lib
 */

gulp.task('jsqrcode', function () {
  return gulp.src(paths.jsqrcode)
    .pipe(uglify({mangle: true}))
    .pipe(concat('jsqrcode.min.js'))
    .pipe(gulp.dest(dirs.buildSrc));
});

/**
 * Building our own scripts
 */

gulp.task('scripts', function() {
  return gulp.src(paths.scripts)
    .pipe(uglify({mangle: true}))
    .pipe(concat('src.min.js'))
    .pipe(gulp.dest(dirs.buildSrc));
});

/**
 * Hinting and testing
 */

gulp.task('hinting', function () {
  return gulp.src(paths.scripts)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

/**
 * Building all of the project
 */

gulp.task('build', ['jsqrcode', 'scripts'], function () {
  return gulp.src(paths.build)
    .pipe(concat(target))
    .pipe(gulp.dest('build'));
});

gulp.task('build-no-uglify', ['jsqrcode', 'scripts'], function () {
  return gulp.src(paths.build)
    .pipe(concat(target))
    .pipe(gulp.dest('build'));
});


/**
 * Auxiliary tasks
 */

gulp.task('clean', function () {
  rimraf(dirs.build, function (err) {
    if (err) {
      console.log("'clean' gulp task raised an error: ", err);
      process.exit(1);
    }
  });
});

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['build']);
});

gulp.task('default', ['hinting', 'build'])
