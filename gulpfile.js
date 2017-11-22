var gulp = require('gulp');
var jasmine = require('gulp-jasmine');
var reporters = require('jasmine-reporters');
var minify = require('gulp-minify');

gulp.task('default', function()
{
	gulp.src('spec/test.js')
	.pipe(jasmine({ 
		reporter: new reporters.JUnitXmlReporter() 
	}));
})

gulp.task('build', function()
{
	gulp.src('lib/*.js')
	.pipe(minify({
		ext:{
			min:'-min.js'
		},
		ignoreFiles: ['*-min.js']
	}))
	.pipe(gulp.dest('lib/'))

	gulp.src('bin/*.js')
	.pipe(minify({
		ext:{
			min:'-min.js'
		},
		ignoreFiles: ['*-min.js']
	}))
	.pipe(gulp.dest('bin/'))
});