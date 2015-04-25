var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    sourcemaps   = require('gulp-sourcemaps'),
    beep         = require('beepbeep'),
    autoprefixer = require('gulp-autoprefixer'),
    iconify      = require('gulp-iconify'),
    rename       = require('gulp-rename'),
    del          = require('del'),
    colors       = require('colors'),
    livereload   = require('gulp-livereload');

gulp.task('sass:dev', function () {

    console.log('[sass]'.bold.magenta + ' Compiling development CSS');

    return gulp.src('www/scss/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'expanded',
            sourceMap: true
        }))
        .on('error', function (error) {
            beep();
            console.log('[sass]'.bold.magenta + ' There was an issue compiling Sass'.bold.red);
            console.error(error.message);
            this.emit('end');
        })
        // Should be writing sourcemaps AFTER autoprefixer runs,
        // but that breaks everything right now.
        .pipe(sourcemaps.write())
        .pipe(autoprefixer({
            browsers: ['last 3 versions', 'ie 9']
        }))
        .pipe(gulp.dest('./www/css'))
        .pipe(livereload());
});

gulp.task('sass:prod', function () {

    console.log('[sass]'.bold.magenta + ' Compiling production CSS');

    return gulp.src('www/scss/*.scss')

        .pipe(sass({
            outputStyle: 'compressed',
            sourcemap: false
        }))

        .on('error', function (error) {
            beep();
            console.error(error);
            this.emit('end');
        })

        .pipe(autoprefixer({
            browsers: ['last 3 versions', 'ie 9']
        }))

        .pipe(gulp.dest('./www/css'));
});

gulp.task('iconify', function() {

    console.log('[iconify]'.bold.magenta + ' Iconifying SVG icons');

    iconify({
        src: './www/img/icon-svg/**/*.svg',
        pngOutput: './www/img/icons',
        scssOutput: './www/scss/icons',
        cssOutput:  './www/css'
    });

});

gulp.task('iconify-sass-cleanup', ['iconify'], function () {

    console.log('[iconify-sass-cleanup]'.bold.magenta + ' Cleaning up iconify\'s Sass mess');

    return gulp.src("./www/scss/icons/icons*")
        .pipe(rename(function (path) {
            path.basename = ('_' + path.basename).replace('.', '-');
        }))
        .pipe(gulp.dest("./www/scss/icons"));

});

gulp.task('iconify-file-cleanup', ['iconify-sass-cleanup'], function () {

    console.log('[iconify-file-cleanup]'.bold.magenta + ' Cleaning up iconify\'s mess');

    del([
        'www/css/icons*',
        'www/scss/icons/icons*',
        'www/scss/icons/_icons-fallback.scss',
        'www/scss/icons/_icons-png.scss',
        'www/img/icons'
    ]);

});

// Watch files for changes
gulp.task('watch', function () {

    console.log('[watch]'.bold.magenta + ' Watching Sass files for changes');

    livereload.listen();
    gulp.watch(['www/scss/**/*.scss'], ['sass:dev']);

});

// Generate Sass files for SVG icons
gulp.task('icons', ['iconify-file-cleanup']);

// Compile Sass and watch for file changes
gulp.task('dev', ['sass:dev', 'watch'], function () {
    return console.log('\n[dev]'.bold.magenta + ' Ready for you to start doing things\n'.bold.green);
});

// Compile production Sass
gulp.task('build', ['sass:prod']);
