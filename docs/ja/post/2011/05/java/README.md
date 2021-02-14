---
title: "Java リフレクションで取得するフィールドの順番"
created: 2011-05-03T12:35:00.000+09:00
tags: ["Java"]
---
リフレクションでフィールドを取得すると、フィールドの順番が何に基づいているのか分からない結果となりました。
<!--more-->
Java API仕様を見ると、確かに順序は決まっていないという記述がありました。

[Class#getFields()](http://java.sun.com/javase/ja/6/docs/ja/api/java/lang/Class.html#getFields())

> この `Class` オブジェクトが表すクラスまたはインタフェースのすべてのアクセス可能な public フィールドをリフレクトする、`Field` オブジェクトを保持している配列を返します。返された配列内の要素は、ソートされていたり、特定の順序になっていたりすることはありません。

Javaの標準的な機能ではフィールドの定義順でフィールド情報を取得することはできなさそうです。

以下のように、フィールド名やアノテーションを使えば順序を規定することはできそうです。

[Java reflection: Is the order of class fields and methods standardized? - stackoverflow](http://stackoverflow.com/questions/1097807/java-reflection-is-the-order-of-class-fields-and-methods-standardized)

これを使って、AndroidのParcelableの実装を汎用化しようと思います。

> Parcelable#writeToParcel(Parcel, int)やコンストラクタにフィールドを列挙するのを毎回書かずに済むようにします。
