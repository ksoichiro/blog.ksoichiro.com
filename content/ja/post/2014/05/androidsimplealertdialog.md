---
title: "AndroidライブラリSimpleAlertDialog"
noEnglish: true
originalCreatedAt: 2014-05-11T13:38:00.001+09:00
tags: ["SimpleAlertDialog","Android"]
---
少し前に作ったものの、紹介エントリを書いていなかったことに気づき今更ながら書いてみる。。。
[SimpleAlertDialog-for-Android](https://github.com/ksoichiro/SimpleAlertDialog-for-Android)という、Androidでダイアログを簡単に作成できるライブラリを公開しています。
![SimpleAlertDialog-for-Android][1]

この手のライブラリは色々あるが、特長は以下の通り(READMEから抜粋)。

* APIレベル4 (Android 1.6 Donut)からレベル19 (Android 4.4 KitKat) で利用可能です。
* Holoスタイルのダイアログを全てのバージョンで使えます。
* `AlertDialog.Builder`のようにシンプルなインタフェースです。
* 基本的なイベントをハンドリングするコールバックが用意してあります。
* ダイアログのライフサイクルは、親となるActivityやFragmentと同期しているため、`IllegalStateException`に悩まされることはありません。
* APIレベル11以上での通常の`Activity`と、android-support-v4ライブラリの`FragmentActivity`の両方をサポートしています。

[デモアプリのダウンロードはこちらから](https://play.google.com/store/apps/details?id=com.simplealertdialog.sample.demos)。

<!--more-->

ダイアログの取り扱いは慣れないと意外と難しく、スリープから復帰したときに`IllegalStateException`でクラッシュするということも普通に起こる。

また、[Android Holo Colors](http://android-holo-colors.com/)を使ってアプリのカラーテーマに合わせてHoloスタイルをカスタマイズしてもダイアログのラインや部品が変わらなかったりする。

というわけで、SimpleAlertDialogはダイアログ共通の問題を吸収し、アプリデザインの統一感を持たせやすくするためのライブラリ。

基本的に古いAlertDialogと同じ扱い方なので、例えば、ダイアログを表示したい場所で以下のように書けば表示できる。

```java
new SimpleAlertDialogFragment.Builder()
        .setMessage("Hello world!")
        .setPositiveButton(android.R.string.ok)
        .create().show(getFragmentManager(), "dialog");
```

配色などはスタイルとしてXMLで指定できるので、以下のようにラインをグラデーションに変えることもできる。

![スクリーンショット][2]


  [1]: /img/2014-05-androidsimplealertdialog_1.png "SimpleAlertDialog"
  [2]: /img/2014-05-androidsimplealertdialog_2.png "ダイアログスタイルのカスタマイズ"
