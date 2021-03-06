---
title: "IntelliJのインデックス対象から除外する方法"
noEnglish: true
originalCreatedAt: 2015-12-11T01:09:00.001+09:00
tags: ["IntelliJ IDEA","Gradle"]
---
IntelliJ IDEAで開発していると、プロジェクト内のファイルが自動的にインデックスされて検索などに利用される。
この機能によって、何かのツールが生成したファイルやログファイルなど、スキャンしてほしくないファイルまでスキャンされ、しかもそれらが頻繁に変更されて何度もスキャンされるため非常に動作が重たくなってしまうことがある。

これを回避するには、build.gradleでideaプラグインを適用して除外してやればいい。
<!--more-->

例えばVagrantを使っている場合は.vagrantディレクトリは無視すべきディレクトリなので以下のように書けばいい。

```groovy
apply plugin: 'idea'

idea {
    module {
        excludeDirs += [
            file('.vagrant'),
        ]
    }
}
```

これで.vagrantディレクトリ以下のファイルはスキャンされなくなる。
(検索にもヒットしなくなるので注意)
.gitignoreに入れているものは上記のexclude設定も入れておく、という感じ。
