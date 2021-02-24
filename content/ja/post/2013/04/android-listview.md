---
title: "Android 単一項目を選択させるListViewの設定"
noEnglish: true
originalCreatedAt: 2013-04-24T01:17:00.001+09:00
tags: ["UI","Android","ListView"]
---
今さら書くものでもないですが、AndroidのListViewにおけるonClickやonItemClick、さらに項目にラジオボタンや チェックボックスがついていた時など毎回混乱するので「この仕様ならこれで動く」というパターンをメモします。
<!--more-->
以下は

- ListViewにラジオボタンつき項目を表示
- 項目は１つだけ選択可能
- 項目が選択されたら(タップされたら)何かする

というパターンです。(以下のイメージ)

[![](/img/2013-04-android-listview_1.png)](/img/2013-04-android-listview_1.png)

リスナーの設定はsetOnItemSelectedListener()ではなくsetOnItemClickListener()であること、 項目を初期選択させるのはsetSelection()ではなくsetItemChecked()であることが注意する点でしょうか。
