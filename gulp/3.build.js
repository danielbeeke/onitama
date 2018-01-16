'use strict';

var gulp = require('gulp');

gulp.task('copy', () => {
  return gulp.src(['src/**/*']).pipe(gulp.dest('dist'));
});

gulp.task('build', gulp.series('compile', 'css', 'copy'));
