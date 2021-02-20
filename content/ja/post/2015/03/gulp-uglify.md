---
title: "gulp-uglify使用時のエラー"
originalCreatedAt: 2015-03-31T07:10:00.001+09:00
tags: ["JavaScript","gulp"]
---
[Sagan](https://github.com/spring-io/sagan)を参考に、CSSとJavaScriptのminifyをしてみようとしたが、jQueryのminifyに失敗する。
使用していたのはgulp-uglifyの1.1.0。

<!--more-->
以下のようなエラーが発生してしまう。

```sh
$ npm run build

> todo@ build /xxx
> gulp build

[23:19:48] Using gulpfile ~/xxx/gulpfile.js
[23:19:48] Starting 'bower-files'...

events.js:72
        throw er; // Unhandled 'error' event
              ^
Error
    at new JS_Parse_Error (/xxx/node_modules/gulp-uglify/node_modules/uglify-js/lib/parse.js:196:18)
    at js_error (/xxx/node_modules/gulp-uglify/node_modules/uglify-js/lib/parse.js:204:11)
    at parse_error (/xxx/node_modules/gulp-uglify/node_modules/uglify-js/lib/parse.js:314:9)
    at Object.next_token [as input] (/xxx/node_modules/gulp-uglify/node_modules/uglify-js/lib/parse.js:562:9)
    at next (/xxx/node_modules/gulp-uglify/node_modules/uglify-js/lib/parse.js:661:25)
    at Context.parse (/xxx/node_modules/gulp-uglify/node_modules/uglify-js/lib/parse.js:647:15)
    at /xxx/node_modules/gulp-uglify/node_modules/uglify-js/tools/node.js:83:33
    at Array.forEach (native)
    at Object.exports.minify (/xxx/node_modules/gulp-uglify/node_modules/uglify-js/tools/node.js:78:15)
    at Transform.minify [as _transform] (/xxx/node_modules/gulp-uglify/index.js:51:21)

npm ERR! todo@ build: `gulp build`
npm ERR! Exit status 8
npm ERR!
npm ERR! Failed at the todo@ build script.
npm ERR! This is most likely a problem with the todo package,
npm ERR! not with npm itself.
npm ERR! Tell the author that this fails on your system:
npm ERR!    gulp build
npm ERR! You can get their info via:
npm ERR!    npm owner ls todo
npm ERR! There is likely additional logging output above.
npm ERR! System Darwin 14.0.0
npm ERR! command "node" "/usr/local/bin/npm" "run" "build"
npm ERR! cwd /xxx
npm ERR! node -v v0.10.28
npm ERR! npm -v 1.4.16
npm ERR! code ELIFECYCLE
npm ERR!
npm ERR! Additional logging details can be found in:
npm ERR!    /xxx/npm-debug.log
npm ERR! not ok code 0
```

それぞれ最新版を使うように変更したのがいけなかったのだと思い、Saganが使っているバージョンに合わせたものの、うまくいかず。
Saganをcloneしてビルドして出力をよく見ると、`npm install`したときのバージョンがbower.jsonに書かれているものと違う。
npm-shrinkwrap.jsonに書かれたバージョンが適用されているらしい。
そこで、gulp-uglifyはこれと同じ0.2.1に変更してみた。
するとエラーは相変わらず出ているもののsaganと同じような内容で、処理自体は続行されminifyできた。

```sh
$ npm run build

> todo@ build /xxx
> gulp build

[23:34:33] Using gulpfile /xxx/gulpfile.js
[23:34:33] Starting 'bower-files'...
Error caught from uglify: Unexpected character '#' in /xxx/src/lib/jquery/build/release-notes.js. Returning unminifed code
Error caught from uglify: Unexpected character '#' in /xxx/src/lib/jquery/build/release.js. Returning unminifed code
Error caught from uglify: Unexpected token: eof (undefined) in /xxx/src/lib/jquery/src/intro.js. Returning unminifed code
Error caught from uglify: Unexpected token: punc (}) in /xxx/src/lib/jquery/src/outro.js. Returning unminifed code
Error caught from uglify: Unexpected token: punc (:) in /xxx/src/lib/jquery/test/data/json_obj.js. Returning unminifed code
[23:34:42] Finished 'bower-files' after 9.34 s
[23:34:42] Starting 'build'...
[23:34:42] Finished 'build' after 9.86 μs
```

主要なファイルは以下の通り。

package.json:

```
{
  (中略)
  "devDependencies": {
    "bower": "1.3.12",
    "gulp": "3.8.11",
    "jshint": "2.6.3",
    "gulp-bower-src": "0.1.0",
    "gulp-minify-css": "1.0.0",
    "gulp-filter": "2.0.2",
    "gulp-sourcemaps": "1.1.3",
    "gulp-uglify": "0.2.1",
    "gulp-util": "3.0.1"
  },
  "scripts": {
    "prepublish": "bower install --config.interactive=false",
    "build": "gulp build"
  }
}
```

bower.json:

```
{
  (中略)
  "dependencies": {
    "jquery": "1.11.2",
    "bootstrap": "3.3.4"
  },
  "overrides": {
    "jquery": {
      "ignore": ["*.json"]
    },
    "bootstrap": {
      "ignore": [
        "js/**", "less/**", "docs/build/**",
        "docs/examples/**", "docs/templates/**", "docs/*.html"
      ]
    }
  }
}
```

gulpfile.js:

```
var gulpFilter = require('gulp-filter'),
    gutil = require('gulp-util'),
    uglify = require('gulp-uglify'),
    bowerSrc = require('gulp-bower-src'),
    sourcemaps = require('gulp-sourcemaps'),
    cssmin = require('gulp-minify-css'),
    gulp = require('gulp');

var paths = {
    css: {
        files: ['src/css/*.css'],
        root: 'src/css'
    },
    dest: './dist/'
};

gulp.task('minify-css', function() {
    return gulp.src(paths.css.files)
        .pipe(cssmin({root: paths.css.root}))
        .pipe(gulp.dest(paths.dest + 'css'));
});

gulp.task('bower-files', function() {
    var filter = gulpFilter(["**/*.js", "!**/*.min.js"]);
    return bowerSrc()
        .pipe(sourcemaps.init())
        .pipe(filter)
        .pipe(uglify())
        .pipe(filter.restore())
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest(paths.dest+'lib'));
});

gulp.task('build', ['minify-css', 'bower-files'], function() {});
```
