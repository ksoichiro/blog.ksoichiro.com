---
title: "JavaFXプロジェクトでの新規Script作成"
created: 2010-05-12T20:22:00.000+09:00
tags: ["JavaFX"]
---
JavaFXプロジェクトをEclipseで作成する際、パッケージはあらかじめ作成しておかなければならないようです。
<!--more-->
存在しないパッケージを指定してJavaFX Scriptを作成すると、以下のようなメッセージが出てしまいます。

```
Resource '/～' does not exist.
```

通常のJavaプロジェクトとは勝手が違うところがあるようです。
