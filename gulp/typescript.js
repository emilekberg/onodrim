const gulp = require('gulp');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const merge = require('merge2');

const tsProject = ts.createProject('tsconfig.json', {
    typescript: require('typescript')
});
exports.build = function build() {
    const tsResult = tsProject.src() // instead of gulp.src(...)
        .pipe(sourcemaps.init())
        .pipe(tsProject());

    return merge([ // Merge the two output streams, so this task is finished when the IO of both operations is done.
        tsResult.dts
            .pipe(gulp.dest('types')),
        tsResult.js
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('dist'))
    ]);
}
