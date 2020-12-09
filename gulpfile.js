var gulp = require('gulp')
var cleanCss = require("gulp-clean-css")
var sourceMaps = require('gulp-sourcemaps')
var concat = require('gulp-concat')
var browserSync = require('browser-sync').create()
var imageMin = require('gulp-imagemin')

gulp.task("css", function () {
  return gulp.src([
    "src/css/canvas-fix.css",
    "src/css/normalize.css",
    "src/css/style.css",
    "src/css/ball.css"
  ])
  .pipe(sourceMaps.init())

  .pipe(concat("style.css"))
  .pipe(
    cleanCss({
      compatibility: 'ie8'
    })
  )
  .pipe(sourceMaps.write())
  .pipe(gulp.dest("dist"))
  .pipe(browserSync.stream())
})

gulp.task("html", function () {
  return gulp.src("src/*.html")
    .pipe(gulp.dest("dist"))
})

gulp.task("fonts", function () {
  return gulp.src("src/fonts/*")
    .pipe(gulp.dest("dist/fonts"))
})

// gulp.task("images", function () {
//   return gulp.src("src/images/*")
//     .pipe(imageMin())
//     .pipe(gulp.dest("dist/images"))
// })

gulp.task("javascript", function () {
  return gulp.src("src/js/*")
    .pipe(gulp.dest("dist"))
})

gulp.task("lib", function () {
  return gulp.src("src/lib/*")
    .pipe(gulp.dest("dist/lib"))
})

gulp.task("watch", function () {

  browserSync.init({
    server: {
      baseDir: "dist"
    }
  })

  gulp.watch("src/*.html", ["html"]).on("change", browserSync.reload)
  gulp.watch("src/css/*.css", ["css"])
  gulp.watch("src/js/*.js", ["javascript"])
  gulp.watch("src/fonts/*", ["fonts"])
  // gulp.watch("src/images/*", ["images"])
})

// gulp.task('deploy', function() {
//   ghpages.publish("dist")
// })

gulp.task('default', ["html", "javascript", "css", "watch", "lib", "fonts"])
