const gulp = require('gulp');


exports.shaders = function shaders() {
    return gulp.src([
        'src/shaders/**/*.vert',
        'src/shaders/**/*.frag'
    ])
    .pipe(gulp.dest('bin/shaders'));
}