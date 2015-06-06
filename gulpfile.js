var gulp         = require('gulp');
var jshint       = require('gulp-jshint');
var sass         = require('gulp-sass');
var sourcemaps   = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var iconify      = require('gulp-iconify');
var rename       = require('gulp-rename');
var livereload   = require('gulp-livereload');
var htmlreplace  = require('gulp-html-replace');
var uglify       = require('gulp-uglifyjs');
var beep         = require('beepbeep');
var del          = require('del');
var chalk        = require('chalk');

gulp.task('copy:views', function () {

    console.log(chalk.magenta.bold('[copy:views]') + ' Copying views to ./dist');

    return gulp.src('./views/**/*.hbs', {base: './views'})
        .pipe(gulp.dest('./dist/views/'));

});

gulp.task('html-replace', ['uglify', 'copy:views'], function() {

    console.log(chalk.magenta.bold('[html-replace]') + ' Replacing some HTML');

    return gulp.src('views/shared/_layout.hbs')
        .pipe(htmlreplace({
            'js': 'js/scripts.min.js'
        }))
        .pipe(gulp.dest('dist/views/shared/'));
});

gulp.task('iconify', function() {

    console.log(chalk.magenta.bold('[iconify]') + ' Iconifying SVG icons');

    iconify({
        src: './static/img/icon-svg/**/*.svg',
        pngOutput: './static/img/icons',
        scssOutput: './static/scss/icons',
        cssOutput:  './static/css'
    });

});

gulp.task('iconify-file-cleanup', ['iconify-sass-cleanup'], function () {

    console.log(chalk.magenta.bold('[iconify-file-cleanup]') + ' Cleaning up iconify\'s mess');

    del([
        'static/css/icons*',
        'static/scss/icons/icons*',
        'static/scss/icons/_icons-fallback.scss',
        'static/scss/icons/_icons-png.scss',
        'static/img/icons'
    ]);

});

gulp.task('iconify-sass-cleanup', ['iconify'], function () {

    console.log(chalk.magenta.bold('[iconify-sass-cleanup]') + ' Cleaning up iconify\'s Sass mess');

    return gulp.src('./static/scss/icons/icons*')
        .pipe(rename(function (path) {
            path.basename = ('_' + path.basename).replace('.', '-');
        }))
        .pipe(gulp.dest('./static/scss/icons'));

});

gulp.task('lint', function() {

    console.log(chalk.magenta.bold('[lint]') + ' Linting JavaScript files');

    return gulp.src(['./**/*.js', '!./**/*.min.js', '!./static/components/**/*.js', '!./static/js/vendor/**/*.js', '!./node_modules/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));

});

gulp.task('sass:dev', function () {

    console.log(chalk.magenta.bold('[sass]') + ' Compiling development CSS');

    return gulp.src('static/scss/*.scss')
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
        .pipe(gulp.dest('./static/css'))
        .pipe(livereload());
});

gulp.task('sass:prod', function () {

    console.log(chalk.magenta.bold('[sass]') + ' Compiling production CSS');

    return gulp.src('static/scss/*.scss')

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

        .pipe(gulp.dest('./static/css'));
});

gulp.task('uglify', function() {

    console.log(chalk.magenta.bold('[uglify]') + ' Concatenating JavaScript files');

    return gulp.src([
            './static/components/jquery/dist/jquery.min.js',
            './static/js/vendor/fontfaceobserver.js',
            './static/js/vendor/verge.js',
            './static/js/jquery.unveil.js',
            './static/js/main.js',
            './static/js/share.js',
            './static/js/heart.js'
        ])
        .pipe(uglify('scripts.min.js'))
        .pipe(gulp.dest('./static/js/'));
});

// Watch files for changes
gulp.task('watch', function () {

    console.log(chalk.magenta.bold('[watch]') + ' Watching Sass files for changes');

    livereload.listen();
    gulp.watch(['static/scss/**/*.scss'], ['sass:dev']);
    gulp.watch(['./**/*.js', '!./static/components/**/*.js', '!./static/js/vendor/**/*.js', '!./node_modules/**/*.js'], ['lint']);
    gulp.watch(['./views/**/*.hbs'], ['copy:views']);

});

// Generate Sass files for SVG icons
gulp.task('icons', ['iconify-file-cleanup']);

// Compile Sass and watch for file changes
gulp.task('dev', ['lint', 'sass:dev', 'copy:views', 'watch'], function () {
    return console.log(chalk.magenta.bold('\n[dev]') + chalk.bold.green(' Ready for you to start doing things\n'));
});

// Compile production Sass
gulp.task('build', ['sass:prod', 'html-replace', 'icons', 'lint']);
