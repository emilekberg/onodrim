const gulp = require('gulp');
const rollup = require('rollup-stream');
const source = require('vinyl-source-stream');
const typescript = require('rollup-plugin-typescript');
const nodeResolve = require('rollup-plugin-node-resolve');
const string = require('rollup-plugin-string');
const sourcemaps = require('gulp-sourcemaps');
const buffer = require('vinyl-buffer');
const rollupSourcemaps = require('rollup-plugin-sourcemaps');

var cache;
exports.bundle = function bundle() {
    return rollup({
        rollup: require('rollup'),
        entry: './bin/index.js',
        sourceMap: true,
        plugins: [
            rollupSourcemaps(),
            string({
                include: [
                    './bin/shaders/*.frag',
                    './bin/shaders/*.vert'
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
        moduleName: 'Onodrim',
        //cache: cache
    })
    .on('bundle', function(bundle) {
        //cache = bundle;
    })
    .pipe(source('onodrim.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist'))
}