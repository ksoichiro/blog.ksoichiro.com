---
title: "yEdでジョブフロー図っぽいものを描く: Layout"
originalCreatedAt: 2019-02-19T00:23:00.001+09:00
tags: ["yEd"]
---
[yEd](https://www.yworks.com/products/yed) でどこまで描けるか？本当に良いかを確認するためいくつか図を描いてみる。以下の続編。
[yEdでジョブフロー図っぽいものを描く: Edge Routing](/ja/post/2019/02/yed-edge-routing/)

## ベースとなる図

前回同様に以下をいじってみる。

![](/img/2019-02-yed-layout_1.png)

レイアウトといいながらEdge Routingから入ってしまったが、今回はメニューのLayout直下の項目を試す。
<!--more-->
### Hierarchical

階層構造。フローチャートに向いているかも。

![](/img/2019-02-yed-layout_2.png)

### Organic

実行するたびに微妙に変わる。

![](/img/2019-02-yed-layout_3.png)

### Orthogonal > Classic

![](/img/2019-02-yed-layout_4.png)

### Orthogonal > UML Style

![](/img/2019-02-yed-layout_5.png)

### Orthogonal > Compact

コンパクトすぎる？

![](/img/2019-02-yed-layout_6.png)

### Orthogonal > Circular

放射状な配置。

![](/img/2019-02-yed-layout_7.png)

### Tree > Directed

Hierarchicalと似ている。

![](/img/2019-02-yed-layout_8.png)

Tree＞Directedの設定画面でDirectedタブを開き、OrientationをBottom To Topにすると以下のようになる。

![](/img/2019-02-yed-layout_9.png)

OrientationをRight To Leftにすると以下。

![](/img/2019-02-yed-layout_10.png)

### Tree > Balloon

Organicと違って何度やっても同じ配置。

![](/img/2019-02-yed-layout_11.png)

### Radial

こちらが本当の放射状らしい。

![](/img/2019-02-yed-layout_12.png)

### Series Parallel

トーナメント表っぽい配置。

![](/img/2019-02-yed-layout_13.png)

パラメータを変えるとさらにいろいろできそうだが、今回はここまで。
