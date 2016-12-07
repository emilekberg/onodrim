const gulp = require('gulp');
const rollup = require('./gulp/rollup');
const typescript = require('./gulp/typescript');

function watch() {
    gulp.watch([
        './src/**/*.ts',
        './shaders/**/*.*'
    ], gulp.series(typescript.build, rollup.bundle));
}

gulp.task('default', gulp.series(typescript.build, rollup.bundle));
gulp.task('bundle', rollup.bundle);
gulp.task('build', typescript.build);
gulp.task('watch', gulp.series(typescript.build, rollup.bundle, watch));
