---
title: "HerokuのGradleビルドパックでSpringアプリを動かす"
createdAt: 2016-10-09T12:41:00.001+09:00
tags: ["Heroku","Gradle","Spring Boot"]
---
以前、[JavaとNode.jsでSpringアプリを動かした](https://github.com/ksoichiro/sbac/tree/c2d1aadc524142eecaa196c57c163ee6eba20f8a)が、自作の gradle-web-resource-plugin を使えば既にJava/Gradleだけで済むようになっていることもあり、[Heroku の Gradle ビルドパック](https://elements.heroku.com/buildpacks/heroku/heroku-buildpack-gradle)に切り替えてみた。

網羅的な手順ではなく、上記アプリのビルドパックを切り替える場合の記録なので注意。
<!--more-->

### Node.jsの利用廃止

#### gradle-web-resource-pluginの導入

`gulpfile.js`、`bower.json` で記述していた内容は `build.gradle` で書けるので、移行して削除。
またこれによりnpmのモジュールも不要になるため `package.json` も削除。
`build.gradle` に追加した部分を抜粋すると以下の通り。

```groovy
plugins {
  id 'com.github.ksoichiro.web.resource' version '1.7.0'
}

apply plugin: 'com.github.ksoichiro.web.resource'

webResource {
  base {
    dest = 'src/main/resources/static'
  }
  bower {
    dependencies {
      install name: 'jquery', version: '1.11.2', filter: ["dist/*.min.*"]
      install name: 'bootstrap', version: '3.3.4', filter: ["dist/css/*.min.css", "dist/js/*.min.js", "dist/fonts/*"]
      install name: 'components-font-awesome', version: '4.3.0', filter: ["css/*.min.css", "fonts/*"]
      install name: 'respond-minmax', version: '1.4.2', filter: ["dest/*.min.js"]
      install name: 'html5shiv', version: '3.7.2', filter: ["dist/*.min.js"]
    }
  }
}
```

#### .bowerrcの追加

そのままだとHerokuでのビルド時にbowerのキャッシュの保存に失敗したため、以下のように設定を追加。

.bowerrc

```json
{
  "storage": {
    "packages" : ".bower/packages"
  }
}
```

### Gradleタスクの追加

プラグインをコンパイル時に動作させるのと、Gradleビルドパックを動作させるために `stage` タスクを追加。
`stage` はビルドができれば良いので `assemble` タスクに依存する設定とした。

```
compileJava.dependsOn 'webResourceCompile'
task stage
stage.dependsOn 'assemble'
```

Herokuでのビルド時には `stage` タスクが呼ばれた後、`Procfile` に従ってアプリが起動される。
`Procfile` は今回は変更なく、以下のような内容。

```
web: java -Xmx256m -Dserver.port=$PORT -jar build/libs/sbac-0.0.1-SNAPSHOT.jar
```

### buildpackの変更

#### .buildpacksを削除

これまで [heroku-buildpack-multi](https://elements.heroku.com/buildpacks/heroku/heroku-buildpack-multi) を使っていたため、以下のような内容でNode.jsとGradleのビルドパックを指定していたが、これは不要になるため削除。

```
https://github.com/robgraeber/heroku-buildpack-nodejs-bower-gulp.git
https://github.com/marcoVermeulen/heroku-buildpack-gradlew.git
```

#### 古いbuildpackの設定を削除

管理画面からでもいいが、以下のコマンドで削除。

```
heroku buildpacks:clear
```

さらに `heroku config` を見ると `BUILDPACK_URL` が残っていたためこちらも削除。

#### app.jsonを追加

Gradleを使うため、`app.json` を追加して `heroku/gradle` を設定した。

```json
{
  "name": "Spring Boot Admin Console",
  "description": "Sample application powered by Spring Boot",
  "image": "heroku/gradle"
}
```

#### dynoを再起動

このままpushしてもrejectされてしまい困ったのだが、一度dynoを再起動してpushしたらうまくいった。
(管理画面右上のメニューから `Restart all dynos` を選択)

---

ここまでの内容は [こちら](https://github.com/ksoichiro/sbac/tree/37dfba565be5894583d632433f00c8aeacbcb36c)。
