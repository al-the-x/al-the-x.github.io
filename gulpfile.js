var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    bower = require('main-bower-files'),
    del = require('del'),
    _ = require('lodash')

_.extend(bower, {
  important: function(file){ // Prioritized assets go in the `<head>`...
    var path = ( _.isString(file) ? file : file.path );

    return path.match(/modernizr|console-polyfill/);
  },
  head: function(){ // Just the `important` components...
    return this({ filter: this.important });
  },
  rest: function(){ // Everything else...
    return this({ filter: _.negate(this.important) });
  }
});

gulp.task('clean', function(){
  return del([ './css/*.css', './js/all.js', './js/head.js' ]);
});

gulp.task('bower:head', [ 'clean' ], function(){
  return gulp.src(bower.head())
    .pipe($.concat('js/head.js'))
  .pipe(gulp.dest('.'));
});

gulp.task('bower:rest', [ 'clean' ], function(){
  return gulp.src(bower.rest().concat([ './js/*.js', '!head.js' ]))
    .pipe($.if(/css/, $.concat('css/vendor.css')))
    .pipe($.if(/js/, $.concat('js/all.js')))
  .pipe(gulp.dest('.'));
});

gulp.task('jade', function(){
  gulp.src('./_jade/{_layouts,_includes}/**/*.jade')
    .pipe($.jade({ pretty: true }))
  .pipe(gulp.dest('.'));
});

gulp.task('build', [ 'clean', 'bower:head', 'bower:rest' ]);

gulp.task('build:watch', function(){
  gulp.watch([
    './js/*.js', '!{head,all}.js',
    'bower.json'
  ], [ 'build' ]);
});

gulp.task('default', [ 'build' ]);
