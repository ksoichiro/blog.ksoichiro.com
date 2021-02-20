---
title: "Gradleスクリプトの構造化"
createdAt: 2015-11-06T01:49:00.001+09:00
tags: ["Gradle"]
---
全然知らなかったのだけど、Gradleのプロジェクトでは、buildSrcというディレクトリを作ればビルド専用のクラスなどを定義できる。
<!--more-->
例えば buildSrc/src/main/groovy/Foo.groovy というファイルを作りclass Fooとか定義すれば、build.gradleから普通に new Foo()というふうに参照できる。
classpathとか書く必要はない。

build.gradleは使っていくうちに段々と肥大化してきてしまうが、これを使えば、複雑なtaskなどはきれいに構造化できるかもしれない。

これまで使っていたやり方としては、`apply from:`を使う方法。
以前本家GradleのGitHub上のプロジェクトを参照したのだが(ここでbuildSrcに気づいても良かったんだが・・・)、gradleディレクトリにいくつもgradleファイルを置いている。

そして、これを `apply from: "${rootDir}/gradle/hoge.gradle"`のように読み込む。

まとまった機能があればこのように切り出せばマルチプロジェクトでもそれなりにまとめられる。

しかしファイルを切り出してもそれはあくまでフラットな構造のスクリプトであり、ぐちゃぐちゃになりやすい。
クラス化したいなぁと思うことが何度もあったが、そんなときにbuildSrcを活用すると良いのかもしれない。
