---
title: "Android 単一項目を選択させるListViewの設定"
created: 2013-04-24T01:17:00.001+09:00
tags: ["UI","Android","ListView"]
---
今さら書くものでもないですが、AndroidのListViewにおけるonClickやonItemClick、さらに項目にラジオボタンや チェックボックスがついていた時など毎回混乱するので「この仕様ならこれで動く」というパターンをメモします。
<!--more-->
以下は

- ListViewにラジオボタンつき項目を表示
- 項目は１つだけ選択可能
- 項目が選択されたら(タップされたら)何かする

というパターンです。(以下のイメージ)

[![](http://2.bp.blogspot.com/-TK99ULK0m1E/UXax3LS9i-I/AAAAAAAAK_Y/fHy-_ueaS8I/s200/device-2013-04-24-010451_edited.png)](http://2.bp.blogspot.com/-TK99ULK0m1E/UXax3LS9i-I/AAAAAAAAK_Y/fHy-_ueaS8I/s1600/device-2013-04-24-010451_edited.png)

リスナーの設定はsetOnItemSelectedListener()ではなくsetOnItemClickListener()であること、 項目を初期選択させるのはsetSelection()ではなくsetItemChecked()であることが注意する点でしょうか。
