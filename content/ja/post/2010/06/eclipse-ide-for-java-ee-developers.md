---
title: "Eclipse IDE for Java EE Developers"
noEnglish: true
originalCreatedAt: 2010-06-20T15:38:00.000+09:00
tags: ["eclipse"]
---
最近まで使ったことなかったのですが、データベースやアプリケーションサーバを使いながら開発するとき、通常のEclipseよりも遥かに便利でした。
<!--more-->
アプリケーションサーバなら、「Servers」ビューからTomcatなどのサーバを起動・停止できます。

[![](/img/2010-06-eclipse-ide-for-java-ee-developers_1.png)](/img/2010-06-eclipse-ide-for-java-ee-developers_1.png)

データベースに関しては、「Database Development perspective」が用意されており、その場でSQLを実行することもできます。

[![](/img/2010-06-eclipse-ide-for-java-ee-developers_2.png)](/img/2010-06-eclipse-ide-for-java-ee-developers_2.png)

Tomcatを利用する場合は、Eclipse内部に「Servers」というプロジェクトが作成され、その中に設定ファイルを作成して、通常のTomcatインストール先の設定を変更せずに利用することができます。
（利用するポート番号は変更しなければなりませんが。）

これらが特にプラグインを加えずに最初から利用できる状態になっているのが良いです。
