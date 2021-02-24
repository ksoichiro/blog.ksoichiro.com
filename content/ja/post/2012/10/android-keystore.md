---
title: "Android keystoreのエイリアス変更方法"
noEnglish: true
originalCreatedAt: 2012-10-18T00:17:00.000+09:00
tags: ["Android"]
---
keystoreのエイリアスを変更する方法です。
<!--more-->
keystoreを作り直せば良い話ですが「もうこのkeystoreで署名したAPKは出回ってしまってるのでkeystoreを作り直すことはできない」という場合に使えそうです。

```sh
keytool -changealias -alias 現在のエイリアス -destalias 新しいエイリアス -keystore keystoreファイル名 -storepass パスワード
```
