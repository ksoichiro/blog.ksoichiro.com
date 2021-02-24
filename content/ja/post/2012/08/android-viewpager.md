---
title: "Android ViewPagerを使った円形のインジケータ"
noEnglish: true
originalCreatedAt: 2012-08-03T01:01:00.000+09:00
tags: ["ViewPager","UI","Android"]
---
左右にスワイプしてページを切り替えるViewPagerというものがありますが、円形のインジケータを使用したサンプルを作成しました。
[viewpagersample](https://bitbucket.org/ksoichiro/viewpagersample)
<!--more-->
既にライブラリとして [ViewPagerIndicator](http://viewpagerindicator.com/) というすばらしいものがあります。が、別のAndroidプロジェクトをいくつも組み込むと環境構築手順やビルド手順も煩雑になりますし、単に円形タイプのインジケータを組み込みたいだけなのでこちらは使いたくない…という方がもしいらしたら、参考にしてみてください。
小さいクラスなので中身もすぐに理解できると思います。

[![](/img/2012-08-android-viewpager_1.png)](/img/2012-08-android-viewpager_1.png)
