const gulp = require('gulp');
const babel = require('gulp-babel');
const clean = require('gulp-clean');
const watch = require('gulp-watch');

gulp.task('clean', () => {
  gulp.src('./bin/*.js').pipe(clean());
});

gulp.task('default', ['clean'], () => {

  watch('./src/*.js', function () {
    gulp.src('./src/*.js').pipe(babel({
      "presets":["es2015"],
      "plugins":[
        "transform-object-rest-spread",
      ]
    })).pipe(gulp.dest('bin'));
  });
});
