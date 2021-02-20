---
title: "iOS UINavigationBarとステータスバーの高さを除いた画面サイズ"
created: 2013-02-16T13:36:00.002+09:00
tags: ["iOS","iPhone"]
---
UINavigationBarの高さとステータスバーの高さを除いた、実際にコンテンツとして表示できる領域を取得する方法のメモです。 ViewControllerの中に書いています。

availableWidth, availableHeightがちゃんと取れているかどうか、確かめるために少し余白を加えて背景色をつけたUITextViewを表示してみました(iPhone4S)。

[![](http://2.bp.blogspot.com/-iyAdF42S6gs/UR8KkcHdVHI/AAAAAAAAKek/5h-sEaQ5S-E/s320/IMG_1153.PNG)](http://2.bp.blogspot.com/-iyAdF42S6gs/UR8KkcHdVHI/AAAAAAAAKek/5h-sEaQ5S-E/s1600/IMG_1153.PNG)
