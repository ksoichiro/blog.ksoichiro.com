---
title: "Android adbコマンドで特定端末を簡単に指定"
originalCreatedAt: 2012-09-09T15:14:00.000+09:00
tags: ["adb","Android"]
---
Androidでテストやデバッグをするとき、複数の端末をつないでadbコマンドを何度も叩くことがあると思います。

デバッグ用のkeystoreで一通り開発した後、一度アンインストールしてからリリース用の署名入りkeystoreで署名してProGuardのかかったapkをインストールし、(内容によっては)adb pullで端末内のファイルを取り出して確認したり…とadbコマンドは意外に多用します。

そんなとき、adbはどの端末に対して実行するのか指定するように言ってきますが それにはadb devicesを実行してシリアル番号を調べないといけません。一度実行すれば別の場所に控えておくことはできますが、やはりコマンドを作るときに毎回シリアル番号をコピー＆ペーストしなければいけません。

こんな手順は面倒すぎる…ということで、シリアル番号を簡単に指定できるシェルスクリプトを作りました。
[ADBS - github](https://github.com/ksoichiro/adbs)
<!--more-->
Mac/Linuxならパスの通ったディレクトリにプログラムを置くだけ動きます。Windowsの場合はCygwin環境でパスの通ったディレクトリに置けば動くかと思います。

これを使うと、シリアル番号の最初の1文字を入力するだけで実行できます。

```sh
$ adb devices
List of devices attached
304D19E0D41F543F  device
275501700028393   device
```

となっているときに、304D19E0D41F543Fの端末に対してshellコマンドを実行するには

```sh
$ adbs -s 3 shell
shell@android:/ $
```

とするだけです。一覧を見てから実行したければ'-s'オプションを外して

```sh
$ adbs shell
List of devices attached
[3] 304D19E0D41F543F
[2] 275501700028393
1st character of the serial number you want to use: 2
shell@android:/ $
```

とできます。
もしシリアル番号の先頭文字が同じ端末があった場合、シリアル番号を前方一致で探しているので

```
$ adbs -s 30 shell
```

のように2文字目以降も指定すれば動くはずです。
