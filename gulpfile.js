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

gulp.task('build', [ 'clean' ], function(){
  gulp.src(bower.head())
    .pipe($.concat('js/head.js'))
    .pipe(gulp.dest('.'));

  gulp.src(bower.rest().concat([ './js/*.js', '!head.js' ]))
    .pipe($.if(/css/, $.concat('css/vendor.css')))
    .pipe($.if(/js/, $.concat('js/all.js')))
  .pipe(gulp.dest('.'));
});

gulp.task('default', [ 'build' ]);
