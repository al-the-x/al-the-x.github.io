var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    bower = require('main-bower-files')
    _ = require('lodash')

_.extend(bower, {
  important: function(path){ // Prioritized assets go in the `<head>`...
    return path.match(/modernizr|console-polyfill/);
  },
  head: function(){ // Just the `important` components...
    return this({ filter: this.important });
  },
  rest: function(){ // Everything else...
    return this({ filter: _.negate(this.important) });
  }
});

gulp.task('bower', function(){
  gulp.src('_layouts/default.html')
    .pipe($.inject(gulp.src(bower.rest(), { read: false }), { name: 'bower' }))
    .pipe(gulp.dest('_layouts'));
});

gulp.task('inject', function(){
  gulp.src('_layouts/default.html')
    .pipe($.inject(gulp.src(bower.head(), { read: false }), { name: 'head' }))
    .pipe($.inject(gulp.src(['js/*.js' ], { read: false })))
    .pipe(gulp.dest('_layouts'));
});

