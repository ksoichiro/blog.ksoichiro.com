---
title: "Android Intentでテキストを共有する時のタイトル"
noEnglish: true
originalCreatedAt: 2012-10-27T01:20:00.004+09:00
tags: ["Intent","Android"]
---
たまにやるとつい忘れてしまうのでメモです。

IntentのExtraにテキストデータを入れて共有するとき、以下のようにすると思います。
<!--more-->
```java
Intent intent = new Intent();
intent.setAction(Intent.ACTION_SEND);
intent.setType("text/*");
intent.putExtra(Intent.EXTRA_SUBJECT, "something");
```

このとき、Intent#putExtra()の第1引数がIntent.EXTRA\_TITLEだとEvernoteなどはタイトルとして認識してくれますが、Gmailなどは認識しません。

メール系のアプリでもタイトルとして扱われるようにするには、Intent.EXTRA\_SUBJECTとする必要があるようです。 EvernoteはIntent.EXTRA\_SUBJECTでもタイトルとして扱っており、こちらの方が適用範囲が広いかもしれません。
