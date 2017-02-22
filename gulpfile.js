var gulp = require('gulp');
var browserify = require('gulp-browserify');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var cp = require('child_process');
var args = require('yargs').argv;
var config = {
	root: './',
	css: {
		dist: "dist/css",
		src: "src/scss"
	},
	js: {
		dist: "dist/js",
		src: "src/js"
	}
},
jekyll = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll',
messages = {
    jekyllBuild: 'Running: $ jekyll build'
},
env = args.env;


// SCRIPTS task, use Browserify to make the magic happen
gulp.task('scripts', function(){
	gulp.src(config.js.src+'/main.js')
		.pipe(browserify({}))
		.pipe(gulp.dest('_site/'+config.js.dist)) // copy to jekyll too
		.pipe(gulp.dest(config.js.dist))
		.pipe(browserSync.stream());
})

// STYLES task, use compile and run through autoprefixer, sourcemaps
gulp.task('styles', function() {
	gulp.src(config.css.src+'/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(postcss([ autoprefixer() ]))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('_site/'+config.css.dist)) // copy to jekyll too
		.pipe(gulp.dest(config.css.dist))
		.pipe(browserSync.stream());
})

// JEKYLL tasks
gulp.task('jekyll-build', function (done) {
    browserSync.notify(messages.jekyllBuild);
    var useConfig = env === 'prod' ? '_config.yml' : '_config.yml,_config.dev.yml';
    return cp.spawn( jekyll, ['build', '--config='+useConfig+'', '--verbose'], {stdio: 'inherit'})
        .on('close', done);
})

gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
})

// BROWSERSYNC task, start the local server
gulp.task('serve', ['scripts', 'styles', 'jekyll-build'], function() {
    browserSync.init({
    	port: 8000,
        server: {
            baseDir: '_site',
        }
    });
})

// WATCH task, watch for changes and reexecute tasks above
gulp.task('watch', function(){
	gulp.watch(config.js.src+'/main.js', ['scripts']);
	gulp.watch(config.css.src+'/**/*.scss', ['styles']);
	// gulp.watch('*.html').on('change', reload);
	gulp.watch([
      '*.html', 
      '_layouts/*', 
      '_includes/*', 
      '_posts/*',
      '_pages/*'
      ], ['jekyll-rebuild']);
})

gulp.task('default', ['serve', 'scripts', 'styles', 'watch']);
gulp.task('build', ['serve', 'watch']);
gulp.task('ci', ['scripts', 'styles', 'jekyll-build']);
