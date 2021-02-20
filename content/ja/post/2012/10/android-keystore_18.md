---
title: "Android keystoreの操作"
originalCreatedAt: 2012-10-18T00:54:00.000+09:00
tags: ["keystore","Android"]
---
AndroidというよりはJDKの話ですが、前のエントリの続きのメモです。
keystoreの変更操作は、バックアップを取ってから実行した方が良いです。
<!--more-->
## keystore内のエントリの確認方法

```
keytool -list -keystore keystoreファイル名 -storepass パスワード
```

## keystoreのキー(エントリ)のパスワード変更方法

```
keytool -keypasswd -alias エイリアス -keypass キーのパスワード -new キーの新しいパスワード -keystore keystoreファイル名 -storepass keystoreのパスワード
```

パスワードをパラメータに指定しない場合は対話形式で入力できるようです。

## keystore自体のパスワード変更方法

```
keytool -storepasswd -keystore keystoreファイル名 -storepass keystoreのパスワード -new keystoreの新しいパスワード
```

念のためですが、これらのパスワード変更をしても署名(証明書のフィンガープリント)が変わってしまうことはなく、パスワード変更前に作ったAPKに対して上書きインストールできました。

## keystore内のエントリの削除方法

例えば、いくつものアプリのキーを1つのkeystoreにまとめてしまっていて、一部のアプリを移管しないといけない場合などに必要かもしれません。
くれぐれも、必要なエントリをうっかり削除しないように気をつけてください。

```
keytool -delete -keystore keystoreファイル名 -alias 削除対象エントリのエイリアス -storepass keystoreのパスワード
```
