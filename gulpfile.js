const gulp = require('gulp');
const rollup = require('rollup-stream');
const source = require('vinyl-source-stream');
const typescript = require('rollup-plugin-typescript');
const nodeResolve = require('rollup-plugin-node-resolve');
const string = require('rollup-plugin-string');
gulp.task('default', () => {
    return rollup({
        entry: './dist/onodrim.js',
        plugins: [
            /*typescript({
                typescript: require('typescript')
            })*/
            string({
                include: [
                    './shaders/*.frag',
                    './shaders/*.vert'
                ]
            }),
            nodeResolve({
                main: true
            })
        ],
        format: 'cjs', 
        moduleName: 'Onodrim'
        
    })
    .pipe(source('onodrim.js'))
    .pipe(gulp.dest('./bin'))
});