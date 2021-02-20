---
title: "Android ナイトモードをダークテーマとして提供する"
originalCreatedAt: 2019-01-08T23:20:00.001+09:00
tags: ["Android"]
---
以前の以下のエントリの関連。
[Android ナイトモードを起動時に設定するとonCreateが二度呼ばれる](/ja/post/2018/12/android-oncreate/)

ナイトモードは時間に応じて自動的に変わる設定もできて、そのようになっているアプリもある。ただ、いくつかのアプリを調べてみた感じでは、現状ではON/OFFの設定のみのアプリが多い印象。三日月のアイコンをタップするとON/OFFが切り替わったり、ダークテーマ、ダークモードなど別の名前で提供されているものも多い。

ON/OFFの切り替えだけなら実質的にはテーマの変更であって、テーマの変更として実現すれば configuration の変更にならず onCreate の二重呼び出しなども発生しない。ナイトモードを適用したからといって起動が遅いのは何かを見落としているのかもしれないが、現状では、単純なON/OFFで提供したいならテーマとして提供する方法が無難かもしれない。

以下、ナイトモードの実装状況について確認したアプリについて記録しておく。
<!--more-->

## ナイトモード/ダークテーマが提供されているアプリの例

提供されている名前、UIで分類して記載する。

### ナイトモード(or ナイトモード相当)

- [Medium](https://play.google.com/store/apps/details?id=com.medium.reader): 「Night mode」として Off/Auto/On が選択可能
- [Simplenote](https://play.google.com/store/apps/details?id=com.automattic.simplenote): 「テーマ」としてライト/ダーク/Dark at night only から選択でき、Dark at night only が自動切り替えのナイトモードと思われる

### 三日月アイコン

- [Twitter](https://play.google.com/store/apps/details?id=com.twitter.android): アイコンのタップでON/OFF切り替えのみ(日中でもダークなまま)

### ダークモード

- [Evernote](https://play.google.com/store/apps/details?id=com.evernote): スイッチでON/OFF切り替えのみ

### ダークテーマ

- [YouTube](https://play.google.com/store/apps/details?id=com.google.android.youtube): ダークテーマとしてON/OFF切り替え
- [Pocket](https://play.google.com/store/apps/details?id=com.ideashower.readitlater.pro): ダークテーマとしてON/OFF切り替え
- [Todoist](https://play.google.com/store/apps/details?id=com.todoist): テーマの中のひとつとして「ダーク」が存在

### その他

- [Kindle](https://play.google.com/store/apps/details?id=com.amazon.kindle): 「色のテーマ」として明るい/濃い が選択可能で、「濃い」がダークなテーマ。
- [Monospace](https://play.google.com/store/apps/details?id=com.underwood.monospace): 画面上部のアイコン(白と黒半々の色のしずくのような形)をタップするとON/OFFが切り替わる
