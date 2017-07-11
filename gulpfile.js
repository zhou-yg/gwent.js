const gulp = require('gulp');
const babel = require('gulp-babel');
const clean = require('gulp-clean');

gulp.task('clean', () => {
  gulp.src('./bin/*.js').pipe(clean());
});

gulp.task('default', ['clean'], () => {

  gulp.src('./src/**/**.js').pipe(babel({
    "presets":["es2015"],
    "plugins":[
      "transform-object-rest-spread",
    ]
  })).pipe(gulp.dest('bin'));
});
