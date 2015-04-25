var gulp         = require('gulp'),
    jshint       = require('gulp-jshint'),
    sass         = require('gulp-sass'),
    sourcemaps   = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    iconify      = require('gulp-iconify'),
    rename       = require('gulp-rename'),
    livereload   = require('gulp-livereload'),
    beep         = require('beepbeep'),
    del          = require('del'),
    chalk        = require('chalk');

gulp.task('sass:dev', function () {

    console.log(chalk.magenta.bold('[sass]') + ' Compiling development CSS');

    return gulp.src('www/scss/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'expanded',
            sourceMap: true
        }))
        .on('error', function (error) {
            beep();
            console.log(chalk.magenta.bold('[sass]') + ' There was an issue compiling Sass'.bold.red);
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

    console.log(chalk.magenta.bold('[sass]') + ' Compiling production CSS');

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

gulp.task('lint', function() {

    console.log(chalk.magenta.bold('[lint]') + ' Linting JavaScript files');

    return gulp.src(['./**/*.js', '!./www/components/**/*.js', '!./node_modules/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));

});

gulp.task('iconify', function() {

    console.log(chalk.magenta.bold('[iconify]') + ' Iconifying SVG icons');

    iconify({
        src: './www/img/icon-svg/**/*.svg',
        pngOutput: './www/img/icons',
        scssOutput: './www/scss/icons',
        cssOutput:  './www/css'
    });

});

gulp.task('iconify-sass-cleanup', ['iconify'], function () {

    console.log(chalk.magenta.bold('[iconify-sass-cleanup]') + ' Cleaning up iconify\'s Sass mess');

    return gulp.src('./www/scss/icons/icons*')
        .pipe(rename(function (path) {
            path.basename = ('_' + path.basename).replace('.', '-');
        }))
        .pipe(gulp.dest('./www/scss/icons'));

});

gulp.task('iconify-file-cleanup', ['iconify-sass-cleanup'], function () {

    console.log(chalk.magenta.bold('[iconify-file-cleanup]') + ' Cleaning up iconify\'s mess');

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

    console.log(chalk.magenta.bold('[watch]') + ' Watching Sass files for changes');

    livereload.listen();
    gulp.watch(['www/scss/**/*.scss'], ['sass:dev']);
    gulp.watch(['./**/*.js', '!./www/components/**/*.js', '!./node_modules/**/*.js'], ['lint']);

});

// Generate Sass files for SVG icons
gulp.task('icons', ['iconify-file-cleanup']);

// Compile Sass and watch for file changes
gulp.task('dev', ['lint', 'sass:dev', 'watch'], function () {
    return console.log(chalk.magenta.bold('\n[dev]') + chalk.bold.green(' Ready for you to start doing things\n'));
});

// Compile production Sass
gulp.task('build', ['sass:prod', 'icons', 'lint']);
