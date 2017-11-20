var gulp = require('gulp');
var jasmine = require('gulp-jasmine');
var reporters = require('jasmine-reporters');

gulp.task('default', function()
{
	gulp.src('spec/test.js')
	.pipe(jasmine({ 
		reporter: new reporters.JUnitXmlReporter() 
	}));
})