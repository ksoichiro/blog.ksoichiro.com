---
title: "Android Studio (Asset Studio) で扱える SVG 画像を Inkscape で作る場合の注意点 (グラデーション)"
created: 2019-01-06T23:22:00.001+09:00
tags: ["Inkscape","SVG","Android Studio","Android"]
---
Asset Studio で、Inkscape で作成した SVG 画像を扱うとき、Inkscape 特有のタグなどのせいでエラーが発生する場合は「プレーンSVG」として保存すれば良さそう。

ただ、この場合は Inkscape のデータが失われる。
参考:

[https://graphicdesign.stackexchange.com/questions/82219/how-to-create-proper-vector-images-that-can-be-used-as-an-android-vector-drawabl](https://graphicdesign.stackexchange.com/questions/82219/how-to-create-proper-vector-images-that-can-be-used-as-an-android-vector-drawabl)

グラデーションに関しては上記では解決せず、
例えば ic\_launcher.svg などを Inkscape で作って Asset Studio でアップロードしようとすると

```
ERROR @ line 83: Gradient has no stop info
```

のようなエラーが出て、グラデーションが適用されない。
<!--more-->

これは Inkscape が以下のように、実際に適用するグラデーションを分離して定義するせいで stop 要素のない linearGradient が作られてしまうのが原因と思われる。

```xml
<linearGradient
   inkscape:collect="always"
   id="linearGradient4389">
  <stop
     id="stopShadow0"
     offset="0"
     style="stop-color:#000000;stop-opacity:0.40000001" />
  <stop
     id="stopShadow1"
     offset="1"
     style="stop-color:#000000;stop-opacity:0;" />
</linearGradient>
<linearGradient
   inkscape:collect="always"
   xlink:href="#linearGradient4389"
   id="linearGradient4395"
   gradientTransform="translate(0,-2)"
   gradientUnits="userSpaceOnUse"
   y2="98"
   x2="94.57196"
   y1="37.802406"
   x1="30" />
```

これは `xlink:href` 属性で単純にリンクされているだけなので、以下のように統合すれば解決する。

```xml
<linearGradient
   id="linearGradient4395"
   gradientTransform="translate(0,-2)"
   gradientUnits="userSpaceOnUse"
   y2="98"
   x2="94.57196"
   y1="37.802406"
   x1="30">
  <stop
     id="stopShadow0"
     offset="0"
     style="stop-color:#000000;stop-opacity:0.40000001" />
  <stop
     id="stopShadow1"
     offset="1"
     style="stop-color:#000000;stop-opacity:0;" />
</linearGradient>
```
