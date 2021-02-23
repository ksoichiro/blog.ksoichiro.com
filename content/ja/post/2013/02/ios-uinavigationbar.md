---
title: "iOS UINavigationBarとステータスバーの高さを除いた画面サイズ"
originalCreatedAt: 2013-02-16T13:36:00.002+09:00
tags: ["iOS","iPhone"]
---
UINavigationBarの高さとステータスバーの高さを除いた、実際にコンテンツとして表示できる領域を取得する方法のメモです。 ViewControllerの中に書いています。

availableWidth, availableHeightがちゃんと取れているかどうか、確かめるために少し余白を加えて背景色をつけたUITextViewを表示してみました(iPhone4S)。

[![](/img/2013-02-ios-uinavigationbar_1.png)](/img/2013-02-ios-uinavigationbar_1.png)
<!--more-->
