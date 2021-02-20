---
title: "Eclipse IDE for Java EE Developers"
created: 2010-06-20T15:38:00.000+09:00
tags: ["eclipse"]
---
最近まで使ったことなかったのですが、データベースやアプリケーションサーバを使いながら開発するとき、通常のEclipseよりも遥かに便利でした。
<!--more-->
アプリケーションサーバなら、「Servers」ビューからTomcatなどのサーバを起動・停止できます。

[![](http://1.bp.blogspot.com/_rtlYXd55yO0/TB22M59W2KI/AAAAAAAAFRk/4IaCCI6Ux7U/s320/WS000028.BMP)](http://1.bp.blogspot.com/_rtlYXd55yO0/TB22M59W2KI/AAAAAAAAFRk/4IaCCI6Ux7U/s1600/WS000028.BMP)

データベースに関しては、「Database Development perspective」が用意されており、その場でSQLを実行することもできます。

[![](http://2.bp.blogspot.com/_rtlYXd55yO0/TB22w_Rjf6I/AAAAAAAAFRs/r3F1M_rO3pA/s320/WS000029.BMP)](http://2.bp.blogspot.com/_rtlYXd55yO0/TB22w_Rjf6I/AAAAAAAAFRs/r3F1M_rO3pA/s1600/WS000029.BMP)

Tomcatを利用する場合は、Eclipse内部に「Servers」というプロジェクトが作成され、その中に設定ファイルを作成して、通常のTomcatインストール先の設定を変更せずに利用することができます。
（利用するポート番号は変更しなければなりませんが。）

これらが特にプラグインを加えずに最初から利用できる状態になっているのが良いです。
