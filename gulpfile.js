let gulp = require('gulp'),
    apidoc = require('gulp-apidoc');
 
gulp.task('apidoc', function(done){
          apidoc({
            src: "app/routes",
            config: "./apidoc.json",
            template: "doc/sections/api",
            dest: "doc/dist"
          },done);
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch('app/routes/**', ['apidoc']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['watch', 'apidoc']);