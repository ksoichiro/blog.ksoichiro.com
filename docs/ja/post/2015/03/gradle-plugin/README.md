---
title: "Gradle Pluginプロジェクトをマルチプロジェクトにするときの注意点"
created: 2015-03-28T18:09:00.001+09:00
tags: ["ライブラリ","Gradle"]
---
Gradle Pluginを作る際、シングルプロジェクト構成なら気にすることはないが、マルチプロジェクト構成にした時にartifactIdが変わってしまったのでその対策のメモ。

AndroidのGradleプラグイン[gradle-eclipse-aar-plugin](https://github.com/ksoichiro/gradle-eclipse-aar-plugin)を開発している時に起きたことだが、当初はシングルプロジェクト構成だったものを後からマルチプロジェクト構成に変更して問題が発生した。

以下のように、プラグインのプロジェクトに名前をつけてあげればいい。

```groovy
rootProject.name = 'gradle-eclipse-aar-plugin'
include ':plugin', ':misc:samplelib'
// ディレクトリ構成上はpluginだが、別名を付ける
project(':plugin').name = 'gradle-eclipse-aar-plugin'
```

これをしないと、`uploadArchives`タスクを実行した時に上記の例で言えば`plugin`が`artifactId`として扱われてしまう。
