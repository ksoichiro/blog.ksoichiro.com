---
title: "Play Framework 2.3をJavaで使うときに困った話(凡ミス)"
created: 2015-03-28T16:25:00.001+09:00
tags: ["Java","Play Framework"]
---
Play Framework 2.3.8を使ってサンプルを作っていた時、
チュートリアルを参考に進めていたつもりだったのだが
Viewなど至るところで`play.api.*`が参照されてしまい
クラスが見つからないエラーが多発した。
てっきりJavaはもうサポートされていないのかな…と
思ってしまったが、単なる凡ミスだった。
`build.sbt`で以下のように`PlayJava`プラグインを使用するように設定すれば良いだけのこと。

```scala
lazy val root = (project in file(".")).enablePlugins(PlayJava)
```

これを、`PlayScala`プラグインを適用していたせいで上手くいかなかったのであった。

恥ずかしい話だが、誰かの役に立つかもしれないのでメモ。
