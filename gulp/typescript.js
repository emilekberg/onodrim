const gulp = require('gulp');
const ts = require('gulp-typescript');
const merge = require('merge2');  // Requires separate installation 
 
const tsProject = ts.createProject('tsconfig.json', {
    typescript: require('typescript')
});
exports.build = function build() {
    const tsResult = tsProject.src() // instead of gulp.src(...) 
        .pipe(tsProject());

    return merge([ // Merge the two output streams, so this task is finished when the IO of both operations is done. 
        tsResult.dts.pipe(gulp.dest('types')),
        tsResult.js.pipe(gulp.dest('dist'))
    ]);
}
    