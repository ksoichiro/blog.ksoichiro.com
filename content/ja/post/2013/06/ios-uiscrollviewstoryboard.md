---
title: "iOS: UIScrollViewをStoryboardで使うときのスクロールのさせ方"
noEnglish: true
originalCreatedAt: 2013-06-27T21:59:00.000+09:00
tags: ["iOS","UIScrollView","Storyboard","iPhone"]
---
基本的なことかと思いますが、しばらく分からず時間を費やしてしまったのでメモします。
UIScrollViewを使って何となくStoryboardでパーツをドラッグ＆ドロップするだけで作っていったところ、スクロールしませんでした。
以下の構造を想定します。
<!--more-->
```
UIView
└UIScrollView
　└// 実際に表示する部品
```

以下はStoryboardでのイメージです。

[![](/img/2013-06-ios-uiscrollviewstoryboard_1.png)](/img/2013-06-ios-uiscrollviewstoryboard_1.png)

サイズにフォーカスしてStoryboardの内容を掲載します。

まず、ルートのViewは当然ながらウィンドウのサイズになります。

[![](/img/2013-06-ios-uiscrollviewstoryboard_2.png)](/img/2013-06-ios-uiscrollviewstoryboard_2.png)

その子ビューとしてUIScrollViewがあり、このサイズは親ウィンドウのサイズにしておきます。
この中身に入るビューの大きさにしないように注意です。

[![](/img/2013-06-ios-uiscrollviewstoryboard_3.png)](/img/2013-06-ios-uiscrollviewstoryboard_3.png)

さらにその子ですが、実際に表示したい大きさを設定します。
(ウィンドウより大きいサイズ)

[![](/img/2013-06-ios-uiscrollviewstoryboard_4.png)](/img/2013-06-ios-uiscrollviewstoryboard_4.png)

そして、ScrollViewとその子ビューのOutletを用意します。
ViewControllerでは以下のようにcontentSizeプロパティを設定します。
これだけです。
これでちゃんとスクロールします。
contentInsetなどは設定不要です。
要するに、contentSizeを正しく設定できれば良いのですが・・・Storyboardだけで完結するようにできるんでしょうか？
上記の検証をした環境とバージョン等の設定を書いておきます。

- Xcode: Version 4.6 (4H127)
- iPhone: iPhone 4S (iOS 5.1.1)
- Base SDK: iOS 6.1
- Deployment Target: 5.0
