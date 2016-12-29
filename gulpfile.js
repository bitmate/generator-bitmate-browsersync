'use strict';

const path = require('path');
const gulp = require('gulp');
const spawn = require('cross-spawn');
const nsp = require('gulp-nsp');

gulp.task('nsp', nodeSecurityProtocol);
gulp.task('test', gulp.series([avaTest, nycReport]));

gulp.task('prepublish', gulp.series('nsp'));
gulp.task('default', gulp.series('test'));

function nodeSecurityProtocol(cb) {
  nsp({package: path.resolve('package.json')}, cb);
}

function avaTest() {
  return spawn('./node_modules/.bin/nyc', ['--all', '--reporter=lcov', './node_modules/.bin/ava'], {stdio: 'inherit'});
}

function nycReport() {
  return spawn('./node_modules/.bin/nyc', ['report', '--colors'], {stdio: 'inherit'});
}
