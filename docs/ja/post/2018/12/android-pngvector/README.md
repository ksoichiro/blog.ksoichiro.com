---
title: "Android PNG画像をVectorに変換する"
created: 2018-12-29T18:44:00.001+09:00
tags: ["Android"]
---
2017年以降 ブログ更新が停滞していたので、シンプル単語帳のアップデートを進める中での課題から。

アプリ内で使う小さい画像ファイルは DPI ごとに用意していて、より大きな解像度が登場すると作り直すようなことをしていたが、これをやらなくて済むようにするのと、アプリのサイズを少しでも減らせたらという思いで、今さらながら VectorDrawable を試した。

対象としたのは「↓」という感じの画像で、以下のようなXMLで簡単につくれる。

```xml
<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:height="48dp"
    android:width="48dp"
    android:viewportHeight="100"
    android:viewportWidth="100" >
    <group
        android:name="arrow">
        <path
            android:name="line"
            android:fillColor="#ffffa713"
            android:pathData="m 25,0 l 0,50 50,0 0,-50 z" />
        <path
            android:name="triangle"
            android:fillColor="#ffffa713"
            android:pathData="m 0,50 l 100,0 -50,50 z" />
    </group>
</vector>
```

結果は以下のような画像になる。

![Arrow](https://lh3.googleusercontent.com/-UyrOp7-KVN0/XCdBgxgqoPI/AAAAAAAAluY/CmVl4pBIlr4PijZa6LcHm3cqXZVd-yDhgCE0YBhgL/s0/20181229001.png)

アニメーションを取り入れるのがより良い使い方と思われるが、目的は達成できた。

パスの編集には以下が参考になる。

[Understanding VectorDrawable pathData commands in Android](https://medium.com/@ali.muzaffar/understanding-vectordrawable-pathdata-commands-in-android-d56a6054610e)
