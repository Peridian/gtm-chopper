
'use strict'

var
    gulp = require('gulp')
    , webpack = require('gulp-webpack')
    , paths = {
        files: {
            scripts:'src/script/*.js'
            , templates: 'src/templates/*.html'
        }
        , directory: {
            dist: './dist/'
            , scripts: './src/script'
            , templates: './src/templates'
        }
    }
    ;

gulp.task('scripts', function () {
    return gulp.src(paths.files.scripts)
        .pipe(webpack({
            watch: true
            , node: { fs: 'empty' }
            , output: {
                filename: 'app.bundle.js'
            }
        }))
        .pipe(gulp.dest(paths.directory.dist));
});
/* 
*/

gulp.task('templates', function () {
    return gulp.src(paths.files.templates)
        .pipe(webpack({
            watch: true
            , output: {
                filename: paths.directory.templates
            },

        }))
        .pipe(gulp.dest(paths.directory.dist));
});

gulp.task('watch', function () {
    gulp.watch(paths.directory.dist, [
        'scripts'
        , 'templates'
    ]);
});

gulp.task('default', [
    'watch'
    , 'scripts'
    , 'templates'
]);