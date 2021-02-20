---
title: "Android SlidingDrawerでwrap_contentを効かせつつ表示/非表示での高さを切り替える"
originalCreatedAt: 2011-05-04T00:21:00.000+09:00
tags: ["UI","Android"]
---
他の部品を隠さずにSlidingDrawerを使い、コンテンツの大きさに合わせてSlidingDrawerをレイアウトする方法についてです。この説明もタイトルも、一言でうまく伝えられないので、まずは完成イメージをまず載せます。

ソースコードは改めて投稿します。
<!--more-->
**完成イメージ**

[![](http://4.bp.blogspot.com/--9rZmcFNCFA/TcAL1iGf4sI/AAAAAAAAFn0/j1iLadVg1Fg/s200/device001.png)](http://4.bp.blogspot.com/--9rZmcFNCFA/TcAL1iGf4sI/AAAAAAAAFn0/j1iLadVg1Fg/s1600/device001.png)

1\. 画面の下方にスクロールする部品があります。(TextView)

[![](http://2.bp.blogspot.com/-z5TBkeFhgeo/TcAL6Zg22ZI/AAAAAAAAFn8/BiVKhy23eYg/s200/device002.png)](http://2.bp.blogspot.com/-z5TBkeFhgeo/TcAL6Zg22ZI/AAAAAAAAFn8/BiVKhy23eYg/s1600/device002.png)

2\. ドロワーを開くと、スクロールするビューのスクロールバーがずれています。つまり、ドロワーで隠れてしまった部分を下方にスクロールすることで表示できます。

[![](http://4.bp.blogspot.com/-5EPROD5DO8Q/TcAL--4adRI/AAAAAAAAFoE/sVhD0mOyz58/s200/device003.png)](http://4.bp.blogspot.com/-5EPROD5DO8Q/TcAL--4adRI/AAAAAAAAFoE/sVhD0mOyz58/s1600/device003.png)

3\. 実際、最下部までスクロールできます。(「終わり」という部分です。)

[![](http://4.bp.blogspot.com/-p3wzIcnK38U/TcAME8DOc7I/AAAAAAAAFoM/R8t-Z3X17ro/s200/device004.png)](http://4.bp.blogspot.com/-p3wzIcnK38U/TcAME8DOc7I/AAAAAAAAFoM/R8t-Z3X17ro/s1600/device004.png)

4\. ドロワーを閉じると、スクロールビューが元のサイズに戻ります。

一見するとごく普通の動きで、Gmailのアプリでもメールのチェックボックスにチェックをつけるとドロワーが現れ、同様の動きをします。

Gmailやspモードメールのアプリの動作を見て、これはSlidingDrawerを使っているのだろう、とあたりをつけた所までは良かったのですが、これを実現するのにかなり苦労してしまいました。

**問題1**

まずSlidingDrawerをよくあるサンプルの通りに作成し、SlidingDrawerのサイズをコンテンツ(上記でいうダミーボタン)のサイズに合わせるためにandroid:layout\_height="wrap\_content"を指定します。

[![](http://4.bp.blogspot.com/-ILG8xoMtOlA/TcANeG0FHAI/AAAAAAAAFoU/2EejIYiJwTE/s200/device005_1.png)](http://4.bp.blogspot.com/-ILG8xoMtOlA/TcANeG0FHAI/AAAAAAAAFoU/2EejIYiJwTE/s1600/device005_1.png)

1\. ドロワーが閉じているにもかかわらず、スクロールビューが非表示になっています。(ドロワーが画面一杯に広がってしまっています。)

[![](http://1.bp.blogspot.com/-x_8MMGDj880/TcANeUcty-I/AAAAAAAAFoc/ENqjj-7t7dY/s200/device006_1.png)](http://1.bp.blogspot.com/-x_8MMGDj880/TcANeUcty-I/AAAAAAAAFoc/ENqjj-7t7dY/s1600/device006_1.png)

2\. ドロワーを開くと、画面一杯にドロワーが開いてしまいます。

**問題2**

wrap\_contentが効かないので、固定値で100dpと指定してみます。

[![](http://2.bp.blogspot.com/-fN4MV1rAaqg/TcANeh5ldkI/AAAAAAAAFos/rvG4Yf6Pumc/s200/device008_2.png)](http://2.bp.blogspot.com/-fN4MV1rAaqg/TcANeh5ldkI/AAAAAAAAFos/rvG4Yf6Pumc/s1600/device008_2.png)

1\. ドロワーを開くと、とりあえずはうまくいっているように見えます。ただ、SlidingDrawerに含めるコンテンツに合わせて100dpの値を調整することになるのであまり良いやり方ではありません。

[![](http://2.bp.blogspot.com/-Kn52GNzQsyQ/TcANesBdg-I/AAAAAAAAFok/bqNqdW3jfuQ/s200/device007_2.png)](http://2.bp.blogspot.com/-Kn52GNzQsyQ/TcANesBdg-I/AAAAAAAAFok/bqNqdW3jfuQ/s1600/device007_2.png)

2\. しかも、ドロワーが閉じていても100dp分の空きスペースができてしまいます。

**問題3**

stackoverflowのQ&Aに、wrap\_contentを有効にする方法がありました。

SlidingDrawerのラッパーを使い、wrap\_contentが有効になるようにonMeasure()をオーバーライドする、ということのようです。

[Android: can height of SlidingDrawer be set with wrap\_content? - stackoverflow](http://stackoverflow.com/questions/3654492/android-can-height-of-slidingdrawer-be-set-with-wrap-content/4265553#4265553)

[![](http://3.bp.blogspot.com/-oIfbZBml_jE/TcANyiyGtBI/AAAAAAAAFo8/1tpBEZbRZwY/s200/device010_3.png)](http://3.bp.blogspot.com/-oIfbZBml_jE/TcANyiyGtBI/AAAAAAAAFo8/1tpBEZbRZwY/s1600/device010_3.png)

1\. このラッパーを使うことでwrap\_contentが効きました。調度よいサイズでドロワーがレイアウトされているようです。

[![](http://4.bp.blogspot.com/-S7whH5kNJl4/TcANe3uSjqI/AAAAAAAAFo0/2AbRIgIvpkk/s200/device009_3.png)](http://4.bp.blogspot.com/-S7whH5kNJl4/TcANe3uSjqI/AAAAAAAAFo0/2AbRIgIvpkk/s1600/device009_3.png)

2\. しかし、やはりドロワーが閉じている状態では空きスペースができてしまいます。

**問題4**

ドロワーが閉じている時は、ウィジェットのサイズを0にするように修正してみます。

[![](http://2.bp.blogspot.com/-Fj85ocjvHrw/TcANy144NKI/AAAAAAAAFpE/BcZdjuZmzcY/s200/device011_4.png)](http://2.bp.blogspot.com/-Fj85ocjvHrw/TcANy144NKI/AAAAAAAAFpE/BcZdjuZmzcY/s1600/device011_4.png)

1\. ドロワーが閉じているときにスクロールビューがきちんと表示されました。

[![](http://1.bp.blogspot.com/-X0W9aj4PhgM/TcANzHryWxI/AAAAAAAAFpM/S-Wwpws1tAM/s200/device012_4.png)](http://1.bp.blogspot.com/-X0W9aj4PhgM/TcANzHryWxI/AAAAAAAAFpM/S-Wwpws1tAM/s1600/device012_4.png)

2\. ドロワーを開くと、スクロールビューがレイアウト調整されて、隠れた部分がスクロールできるようになっているのがスクロールバーの位置からわかります。

[![](http://2.bp.blogspot.com/-1QRoN0YNCyk/TcANzDNr3UI/AAAAAAAAFpU/4GGf6Dr4Ezk/s200/device013_4.png)](http://2.bp.blogspot.com/-1QRoN0YNCyk/TcANzDNr3UI/AAAAAAAAFpU/4GGf6Dr4Ezk/s1600/device013_4.png)

3\. 実際に隠れた部分を表示できました。これでやっと完成、と思いましたが…

[![](http://2.bp.blogspot.com/-Xcyo6eIZzdY/TcANzVO2X4I/AAAAAAAAFpc/VgBihhmbjXU/s200/device014_4.png)](http://2.bp.blogspot.com/-Xcyo6eIZzdY/TcANzVO2X4I/AAAAAAAAFpc/VgBihhmbjXU/s1600/device014_4.png)

4\. ドロワーを閉じると空きスペースができてしまいます…

Android SDKのソースコードもざっと見てみましたが、どうやらドロワーが閉じたときは再レイアウトされないようです。ドロワーを閉じたとき(onDrawerClosed())にrequestLayout()を呼ぶようにしたところ、最初の完成イメージのようになりました。

**別の問題**

RelativeLayoutで、スクロールビューがドロワーの位置をandroid:layout\_aboveで指定しているために上記のような問題が起こります。これを外すと、スクロールビューのレイアウトはドロワーのレイアウトの影響を受けなくなります。

[![](http://2.bp.blogspot.com/-9goK7nZqtkU/TcAN_Q2OVWI/AAAAAAAAFpk/oXvWYK2NpVU/s200/device015_5.png)](http://2.bp.blogspot.com/-9goK7nZqtkU/TcAN_Q2OVWI/AAAAAAAAFpk/oXvWYK2NpVU/s1600/device015_5.png)

1\. ドロワーが閉じているときに空きスペースができてしまうようなことはありません。

[![](http://3.bp.blogspot.com/-ZVrpZm34pcU/TcAN_hxi3_I/AAAAAAAAFps/3xDIJjGp9ck/s200/device016_5.png)](http://3.bp.blogspot.com/-ZVrpZm34pcU/TcAN_hxi3_I/AAAAAAAAFps/3xDIJjGp9ck/s1600/device016_5.png)

2\. その代わり、ドロワーが表示されるとドロワーで隠れた部分を見ることができなくなります。
