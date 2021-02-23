---
title: "yEdでジョブフロー図っぽいものを描く: Edge Routing"
originalCreatedAt: 2019-02-19T00:15:00.001+09:00
tags: ["yEd"]
---
[yEd](https://www.yworks.com/products/yed) でどこまで描けるか？本当に良いかを確認するためいくつか図を描いてみる。

## ベースとなる図の作成

まずPaletteのFlowchartのSectionから、適当にボックスをドラッグアンドドロップする。

ダブルクリックでラベルを入力。

オブジェクトからオブジェクトへドラッグするとラインが引かれる。

オブジェクトの配置の際には、ガイドとなるラインが表示されるため縦横とも周囲の部品と合わせた位置に置くことができる。

ここまでで作れたのが以下。

![](/img/2019-02-yed-edge-routing_1.png)

レイアウトをいろいろとうまくやってくれるのが yEd の良いところのようなので試してみる。今回はEdge Routing。
<!--more-->
## Edge Routing

オブジェクトを結ぶ線の引き方のことと思われる。
メニューのLayout＞Edge Routingで選択できる。以下はそれぞれデフォルトのパラメータで設定している。

### Orthogonal/Polyline

Orthogonal＝直交らしい。単純な操作でこれができるのはすごい。Excelではできない。線が数回折れているのがPolylineということだろうか。

![](/img/2019-02-yed-edge-routing_2.png)

### Orthogonal Channel

Job4の右側に回り込んでいる点が特徴的？どういう意味の配置だろう。

![](/img/2019-02-yed-edge-routing_3.png)

### Orthogonal Bus-style

確かにBUSっぽい引き方。

![](/img/2019-02-yed-edge-routing_4.png)

### Orthogonal

Excelでコネクタを使うとこうなる。

![](/img/2019-02-yed-edge-routing_5.png)

### Organic

単純にオブジェクトからオブジェクトへ線を引いた場合と同じ。

![](/img/2019-02-yed-edge-routing_6.png)

### Straight Line

Organicと変わらない結果。適用範囲によっては変わるかもしれない。

全く同じ画像だったため割愛。

今回はここまで。

続き： [yEdでジョブフロー図っぽいものを描く: Layout](/ja/post/2019/02/yed-layout/)
