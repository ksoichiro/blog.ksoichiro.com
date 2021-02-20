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

![](https://lh3.googleusercontent.com/6kHbpHvpI5Fq7tjYBYylbP11t2RNFUVcfZiqJOriLMHqACQIk-YL83bNH9RoN_2rMmrnpzqJffCCmw=s0)

レイアウトをいろいろとうまくやってくれるのが yEd の良いところのようなので試してみる。今回はEdge Routing。
<!--more-->
## Edge Routing

オブジェクトを結ぶ線の引き方のことと思われる。
メニューのLayout＞Edge Routingで選択できる。以下はそれぞれデフォルトのパラメータで設定している。

### Orthogonal/Polyline

Orthogonal＝直交らしい。単純な操作でこれができるのはすごい。Excelではできない。線が数回折れているのがPolylineということだろうか。

![](https://lh3.googleusercontent.com/Nxx1yhSjIe7JfA2Wqi01pTBA98CsOX_VFh-lk-6MEDHN6MHLqMQ2O_s0DDwhZdTV5v5AgS96tMIt0g=s0)

### Orthogonal Channel

Job4の右側に回り込んでいる点が特徴的？どういう意味の配置だろう。

![](https://lh3.googleusercontent.com/sWuY-RPv83d5vWss_PNyiTHqiNPuVNVdP7LwZloQmFwzHbdn0-Z_ATcwNpgWUdXhTXFtbliNyvbJhA=s0)

### Orthogonal Bus-style

確かにBUSっぽい引き方。

![](https://lh3.googleusercontent.com/fRP5IX9dz7np0ZkTyoyFH_sgX2W3pIv6soSDl7cz5kTGbMKTTcA7yh-cOmY0K5bzLy_8G7tZDPTBHg=s0)

### Orthogonal

Excelでコネクタを使うとこうなる。

![](https://lh3.googleusercontent.com/KtjmlRpWgHxv54sYgloCrjj6QGjf6n4hTkxceEOgPJVCAxhNTy5S5NybIrYe5bW6zT6dMqFTa_Rmwg=s0)

### Organic

単純にオブジェクトからオブジェクトへ線を引いた場合と同じ。

![](https://lh3.googleusercontent.com/wd-NNWr9nHpDcs4xsPfaiTXjuK5HIpYGXzj1-g4zIxAYIbulZDbTI41uKufhN1zxmYG-CnjDV2Jh5g=s0)

### Straight Line

Organicと変わらない結果。適用範囲によっては変わるかもしれない。

全く同じ画像だったため割愛。

今回はここまで。

続き： [yEdでジョブフロー図っぽいものを描く: Layout](/ja/post/2019/02/yed-layout/)
