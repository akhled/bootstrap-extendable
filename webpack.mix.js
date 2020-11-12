const mix = require('laravel-mix');
const del = require('del');
const postcss = require('postcss');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for your application, as well as bundling up your JS files.
 |
 */

// Set output path to dist
mix.setPublicPath('dist');

/**
 * Build stylesheets
 */
mix.sass(
	'scss/bootstrap-extendable.scss',
	mix.inProduction()
		? 'dist/bootstrap-extendable.min.css'
		: 'dist/bootstrap-extendable.css'
);

if (mix.inProduction()) {
} else {
	/**
	 * Generate documentation
	 */
	del('styleguide');

	mix.sass('scss/bootstrap-extendable.doc.scss', 'build/doc.css').options({
		postCss: [require('./build/take-classes-out.js')(), require('mdcss')()],
	});
}
