const rollup = require('rollup');
const nodeResolve = require('rollup-plugin-node-resolve');
const string = require('rollup-plugin-string');
const rollupSourcemaps = require('rollup-plugin-sourcemaps');

let cache;
exports.bundle = function bundle() {
	return rollup.rollup({
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
						'.js'
					]
			})
		]
	})
	.then((bundle) => {
		cache = bundle;
		bundle.write({
			format: 'cjs',
			moduleName: 'Onodrim',
			dest: './dist/onodrim.js',
			sourceMap: true
		});
	});
}