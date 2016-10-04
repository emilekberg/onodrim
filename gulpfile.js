const gulp = require('gulp');
const rollup = require('rollup-stream');
const source = require('vinyl-source-stream');
const typescript = require('rollup-plugin-typescript');
const nodeResolve = require('rollup-plugin-node-resolve');

gulp.task('default', () => {
    return rollup({
        entry: './dist/onodrim.js',
        plugins: [
            /*typescript({
                typescript: require('typescript')
            })*/
            nodeResolve({
                main: true
            })
        ],
        format: 'iife', 
        moduleName: 'Onodrim'
        
    })
    .pipe(source('onodrim.js'))
    .pipe(gulp.dest('./bin'))
});