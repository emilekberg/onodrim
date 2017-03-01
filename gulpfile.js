const gulp = require('gulp');
const rollup = require('./gulp/rollup');
const typescript = require('./gulp/typescript');
const copy = require('./gulp/copy');
function watch() {
    gulp.watch([
        './src/**/*.ts',
        './src/**/*.frag',
        './src/**/*.vert'
    ], gulp.series(typescript.build, copy.shaders, rollup.bundle));
}

gulp.task('default', gulp.series(typescript.build, copy.shaders, rollup.bundle));
gulp.task('bundle', rollup.bundle);
gulp.task('build', typescript.build);
gulp.task('watch', gulp.series(typescript.build, copy.shaders, rollup.bundle, watch));
