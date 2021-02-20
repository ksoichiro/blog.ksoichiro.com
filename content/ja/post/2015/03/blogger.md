---
title: "Bloggerでモバイル表示時に横スクロールが発生..."
originalCreatedAt: 2015-03-29T18:22:00.001+09:00
tags: ["CSS","Blogger","PageSpeed Insights"]
---
[PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/)を使ってこのブログを色々改善しようと考えた。
それなりに改善したものもあるし、Bloggerを使っている限り難しそうなものも多いので諦めているものもあるが、その中で「なぜ？」というものがあった。
下記の警告。

> コンテンツのサイズを表示域に合わせる
ページ コンテンツの幅が表示域に対して広すぎるため、水平方向へのスクロールが必要になります。ユーザー エクスペリエンスを向上させるためにページ コンテンツのサイズを表示域に合わせてください。
ページ コンテンツの幅は 360 CSS ピクセルですが、表示域の幅は 320 CSS ピクセルしかありません。次の要素が表示域から外れています:
要素「`<div class="widget-content"></div>`」が表示域から外れています。

確かに、モバイルのエミュレーションで確認すると右側に余白ができており、横スクロールが発生している…。
<!--more-->
margin、padding、viewport、min-width、position、box-sizing、等々を調べてみるものの一向に原因が見つからず…。

Chromeのデベロッパーツールで一つずつ`display:none`を適用して改善するか試していくと、最終的にテンプレートのCSSに含まれるAdSenseのmarginの設定が問題だと分かった。
以下のような部分：

```css
body.mobile .AdSense {
  margin: 0 -40px;
}
```

上記(の元になっているskinのCSS)を削除するか、以下のように別のCSSで右側のmarginの設定を修正すれば解決。

```css
body.mobile .AdSense {
    margin-right:0;
}
```
