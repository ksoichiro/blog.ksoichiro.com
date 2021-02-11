---
title: "[Android] keystoreパスワードの復元(変更)"
created: 2013-09-15T17:25:00.000+09:00
tags: ["keystore","Android"]
---
先日、個人で開発しているアプリのリリース用keystoreのパスワードが分からなくなるという(個人的に)とんでもない事態が起こりました。
一応、解決できたので方法を書き留めておきます。
ただし、解決できる条件は「エイリアスのパスワードは分かる」ということです。

Antやkeytool、ADTのExportツールなどを使うとキーストアのパスワードが間違っているせいでエラーになっていましたが、実はエイリアスのパスワードは正しかったのです。
というのは、Android Keystore Password Recoverを使って分かりました。
[https://code.google.com/p/android-keystore-password-recover/](https://code.google.com/p/android-keystore-password-recover/)

```sh
java -jar AndroidKeystoreBrute\_v1.03.jar -m 3 -k production.keystore -d wordlist.txt
```

これでキーストア内のエイリアスのパスワードを見つけることができた場合、
あとはキーストアのパスワードが見つかれば…ということなのですが
これがどうしても分かりませんでした。
このツールでどうにかできないか…と調べていると

```sh
java -jar AndroidKeystoreBrute\_v1.03.jar -m 3 -k production.keystore -d wordlist.txt -w
```

と「-w」オプションを付けることで
そのパスワードをキーストアのパスワードに設定できることが分かりました。
(エイリアスのパスワードをキーストアのパスワードにする)
上記の場合なら、パスワード変更されたファイルがproduction.keystore\_recoveredとして生成されます。
バックアップを取っておいたファイルと、パスワード変更されたファイルに対して
keytoolの出力を比べてみると、証明書のフィンガープリントは変わっていませんでした。
実際にパスワード変更したkeystoreを使ってGoogle Playでアップデートすることもできました。

(参考)
ちなみに、上記の既存アプリについて、デバッグビルドしたAPKをアップロードすると、zipalignされていないとエラーが出ます(あくまで現時点の仕様)。
じゃあzipalignすれば…

```sh
zipalign 4 hoge.apk hoge-aligned.apk
```

とzipalignしたものをアップロードすると、証明書のフィンガープリントが違うというエラーが出ます。
フィンガープリントが一致しなければアップデートができません。
