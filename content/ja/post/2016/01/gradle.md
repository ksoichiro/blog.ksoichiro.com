---
title: "Gradleで特定の名前のサブディレクトリリストを取得する方法"
noEnglish: true
originalCreatedAt: 2016-01-11T20:09:00.001+09:00
tags: ["IntelliJ IDEA","Gradle"]
---
滅多に使わないかもしれないマニアックな話題。
Gradle＋IntelliJ IDEAで開発している時、idea.module.excludeDirsプロパティにディレクトリのfileオブジェクトのリストを設定すると、そのディレクトリはスキャンの対象から外され、内容が変化してもIntelliJの動作がもたつくことがなくなる。
参考：[IntelliJのインデックス対象から除外する方法](/ja/post/2015/12/intellij/)

このとき、excludeDirsはただのリストなので、a, b, c, というディレクトリの下にあるbuild/というディレクトリをまとめて無視したいと思っても、a/build, b/build, c/build をそれぞれ設定する必要がある。
これをbuildという名前で一括する方法の話。
<!--more-->

以下のような構造があったとする。

```
samples/
├── a/
│   ├── .gradle/
│   └── build/
├── b/
│   ├── .gradle/
│   └── build/
└── c/
    ├── .gradle/
    └── build/
```

素直に除外設定を書こうとすると次のようになってしまいサンプルが増えるためにメンテナンスしなければならない。

```groovy
idea.module.excludeDirs += [
    file('a/.gradle'),
    file('a/build'),
    file('b/.gradle'),
    file('b/build'),
    file('c/.gradle'),
    file('c/build'),
]
```

a, b, cがGradleのプロジェクトなら次のように書ける(かもしれない。未確認)のだが・・

```groovy
subprojects {
    idea.module.excludeDirs += [
        project.file('.gradle'),
        project.file('build'),
    ]
}
```

上記のディレクトリ構造は、それぞれが独立したGradleプロジェクトでありサブプロジェクトではなかったため、subprojectsでの指定ができなかった。

そこで解決策として以下のように設定してみたところ、うまくいった。

```groovy
fileTree(dir: "samples").visit { details ->
    if (details.name in ['.gradle', 'build']) {
        idea.module.excludeDirs << details.file
    }
}
```

samplesディレクトリのツリー内を順番にチェックして、指定の名前にマッチする場合は除外する。
