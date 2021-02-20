---
title: "Android 見つけにくいResources$NotFoundExceptionの原因"
originalCreatedAt: 2011-05-05T22:25:00.000+09:00
tags: ["UI","Android"]
---
TextViewに文字列や数値を表示する画面を作りました。
正しくレイアウトのXMLを記述して、プロジェクトも再ビルドして、R.javaにIDは存在しているはずなのに
Resources$NotFoundExceptionが出てしまいました…。
<!--more-->
しばらく例外メッセージの中の「見つからない」と言われているIDを見ていて、気づきました。

TextViewにはsetText(CharSequence text)だけでなくsetText(int resid)があるのです。

そのため、以下のようなコードを書くとコンパイルエラーは出ません。

```java
int price = 1000;
((TextView) view.findViewById(R.id.price)).setText(price);
```

これを動かすと、リソースID「1000」のR.stringを探そうとするので上記の例外が発生します。

例えば以下のようにres/values/string.xmlが書いてあったとします。

```xml
<resources>
    <string name="app_name">Test</string>
</resources>
```

この場合は以下のようにすれば「Test」がTextViewに表示されます。

```java
((TextView) view.findViewById(R.id.price)).setText(R.string.app_name);
```

最初の例外が出る例は、以下のように文字列に変換すれば動きます。

```java
int price = 1000;
((TextView) view.findViewById(R.id.price)).setText(Integer.toString(price));
```

数値はCharSequenceではないので当たり前の動作なのですが、コンパイルエラーが出ないので注意した方が良さそうです。
本当は、R.javaの定数がintなどのプリミティブ型でなく列挙型等になっていると、間違ってint型を指定してもコンパイル時に検出できて良いのですけどね。
