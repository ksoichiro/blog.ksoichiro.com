---
title: "Android Drawableのattrを定義"
noEnglish: true
originalCreatedAt: 2013-01-11T06:04:00.000+09:00
tags: ["UI","Android"]
---
ライブラリなどを作る際、styleを使ってDrawableをカスタマイズ可能にするときの方法です。 ライブラリ側のattrs.xmlに属性を定義します。formatはreferenceで良いです。  styleableも定義します。  ライブラリ側のアイコンをロードする部分です。  利用アプリ側で、独自の画像を指定するスタイルを定義します。(styles.xmlなど)  利用アプリ側で、スタイルを適用します。(AndroidManifest.xml)  以上です。 注意しなければいけないのは、アイコンをロードする部分で mContextと書いているContextはActivityのテーマが適用されているものでなければならない点です。 Activityそのものなら有効ですが、Activity#getBaseContext()をContextとして使ってしまうと、適用されているテーマが取得できません。 (他にも有効なものがあるかもしれません。)
<!--more-->
