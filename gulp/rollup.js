const gulp = require('gulp');
const rollup = require('rollup-stream');
const source = require('vinyl-source-stream');
const typescript = require('rollup-plugin-typescript');
const nodeResolve = require('rollup-plugin-node-resolve');
const string = require('rollup-plugin-string');
const sourcemaps = require('gulp-sourcemaps');
const buffer = require('vinyl-buffer');
exports.bundle = function bundle() {
    return rollup({
        entry: './dist/onodrim.js',
        sourceMap: true,
        plugins: [
            string({
                include: [
                    './shaders/*.frag',
                    './shaders/*.vert'
                ]
            }),
            nodeResolve({
                main: true,
                extensions: [
                    '.ts', '.js'
                ]
            })
        ],
        format: 'cjs', 
        moduleName: 'Onodrim'
        
    })
    .pipe(source('onodrim.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./bin'))
}