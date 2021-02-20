---
title: "iOS: UIScrollViewをStoryboardで使うときのスクロールのさせ方"
createdAt: 2013-06-27T21:59:00.000+09:00
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

[![](http://4.bp.blogspot.com/-uiNBuPr6nsE/UcwyRvmDsAI/AAAAAAAALpY/Y8MeVJ_zyS0/s268/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88+2013-06-27+21.24.40.png)](http://4.bp.blogspot.com/-uiNBuPr6nsE/UcwyRvmDsAI/AAAAAAAALpY/Y8MeVJ_zyS0/s268/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88+2013-06-27+21.24.40.png)

サイズにフォーカスしてStoryboardの内容を掲載します。

まず、ルートのViewは当然ながらウィンドウのサイズになります。

[![](http://3.bp.blogspot.com/-W8J2_JHuKGw/UcwyTjVJlAI/AAAAAAAALpg/LGet7LoU0oQ/s640/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88+2013-06-27+21.24.55.png)](http://3.bp.blogspot.com/-W8J2_JHuKGw/UcwyTjVJlAI/AAAAAAAALpg/LGet7LoU0oQ/s1480/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88+2013-06-27+21.24.55.png)

その子ビューとしてUIScrollViewがあり、このサイズは親ウィンドウのサイズにしておきます。
この中身に入るビューの大きさにしないように注意です。

[![](http://3.bp.blogspot.com/-PtNyA91sWxA/UcwyT78YTOI/AAAAAAAALpk/NcE5lKlUh30/s640/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88+2013-06-27+21.25.01.png)](http://3.bp.blogspot.com/-PtNyA91sWxA/UcwyT78YTOI/AAAAAAAALpk/NcE5lKlUh30/s1480/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88+2013-06-27+21.25.01.png)

さらにその子ですが、実際に表示したい大きさを設定します。
(ウィンドウより大きいサイズ)

[![](http://2.bp.blogspot.com/-BdojBK76eMI/UcwyVScrynI/AAAAAAAALpw/rlNi6sAiEXI/s640/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88+2013-06-27+21.25.06.png)](http://2.bp.blogspot.com/-BdojBK76eMI/UcwyVScrynI/AAAAAAAALpw/rlNi6sAiEXI/s1480/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88+2013-06-27+21.25.06.png)

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
