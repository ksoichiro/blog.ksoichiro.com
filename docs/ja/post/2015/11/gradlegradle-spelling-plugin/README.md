---
title: "Gradleで表記ゆれをチェックするプラグインgradle-spelling-plugin"
created: 2015-11-26T22:36:00.001+09:00
tags: ["Gradle"]
---
[GradleからCoffeeScript、LESS、Bowerを使うプラグインgradle-web-resource-plugin](http://ksoichiro.blogspot.jp/2015/10/gradlecoffeescriptlessbowergradle-web.html)
に続き、Javaプロジェクトの開発で使えるGradleプラグイン [gradle-spelling-plugin](https://github.com/ksoichiro/gradle-spelling-plugin) を作ったので紹介。

これで何ができるかというと、ブラックリストに単語、表現を登録して、それを探していくだけ。
見つけた場合は、代わりにこれを使ってね、と警告する。
見つけた場合にビルドエラーとするかどうかは設定できる。
それだけ、ではあるのだけれど、ちょうどいいものが見つからなかったので作った。

Gradleを使い出すと、Gradleですべてチェックできるようにしたいと考えるようになる(たぶん)。
そして自動化したいと考える。
だから、grepしたりIDEで検索すればいいものだったとしても
Gradleで使える形になっていることが大事。
<!--more-->

内容的には以前Goで作った[fint](https://github.com/ksoichiro/fint)とほぼ同じ。
fintの方はLintツール的な発想で作ったが、
今回のものは似たような用語がバラバラとコメントなどに
書かれていくのを人がレビューで見つけて修正していくのを避けたかった、という点で微妙に着想・目的が違う。

組み込みは、Gradle 2.1以降なら以下をbuild.gradleに書けばOK。

```groovy
plugins {
    id "com.github.ksoichiro.spelling" version "0.0.2"
}
```

設定は同じくbuild.gradleに

```groovy
spelling {
    excludes += 'build.gradle'
    message "%1sではなく%2sにしてね"
    definition {
        rules {
            define forbidden: 'Hoge', recommended: 'Fuga'
        }
    }
}
```

などとする。
チェックは`inspectSpelling`というタスクで実行できるので、
もしcheckタスクですべてチェックさせるルールにしているのであれば

```
check.dependsOn 'inspectSpelling`
```

としておけば

```
$ ./gradlew check
...
:inspectSpelling
/xxx/src/main/java/com/example/A.java:4: HogeではなくFugaにしてね
:inspectSpelling FAILED

FAILURE: Build failed with an exception.

* What went wrong:
Execution failed for task ':inspectSpelling'.
> Spelling inspection failed: 1 violations found
```

というふうに、正しい用語を使うことを強制できる。
