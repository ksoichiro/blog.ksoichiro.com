---
title: "Spring BootのIntelliJでのホットスワップ"
created: 2015-03-31T06:32:00.001+09:00
tags: ["IntelliJ","Spring Boot"]
---
ソースコードの修正に合わせて実行中のSpring Bootアプリケーションを自動的にリロードさせる方法（ホットスワップ）について。
基本的な方法は[Spring Bootのドキュメント](http://docs.spring.io/spring-boot/docs/current/reference/html/howto-hotswapping.html)に書いてあるのだが、
実際に試してみて、bootRunの実行中に修正してもロードされず、困っていた。
このとき実は、bootRunをIntelliJ IDEA CE (14.0)のGradleビューのタスクをダブルクリックすることで実行していたのだが、これがいけなかった。
IntelliJのGradleビューからbootRunを実行してしまうと自動ビルドの対象外になってしまう。

IntelliJの設定で`Build, Execution, Deployment` > `Compiler`の設定項目をよく見ると

> Make project automatically (only works while not running / debugging)

と書いてある。
（＝自動的なビルドは、実行・デバッグをしていないときにのみ有効）

つまり、Macならターミナル、Windowsならコマンドプロンプトなどで `gradlew bootRun` を別で実行しておけば、IntelliJ自体はrunningでもdebuggingでもない状態なので、ファイルの保存時にコンパイル・ホットスワップしてくれる。
