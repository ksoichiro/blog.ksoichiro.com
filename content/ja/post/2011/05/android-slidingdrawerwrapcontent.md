---
title: "Android SlidingDrawerでwrap_contentを効かせつつ表示/非表示での高さを切り替える"
noEnglish: true
originalCreatedAt: 2011-05-04T00:21:00.000+09:00
tags: ["UI","Android"]
---
他の部品を隠さずにSlidingDrawerを使い、コンテンツの大きさに合わせてSlidingDrawerをレイアウトする方法についてです。この説明もタイトルも、一言でうまく伝えられないので、まずは完成イメージをまず載せます。

ソースコードは改めて投稿します。
<!--more-->
**完成イメージ**

[![](/img/2011-05-android-slidingdrawerwrapcontent_1.png)](/img/2011-05-android-slidingdrawerwrapcontent_1.png)

1\. 画面の下方にスクロールする部品があります。(TextView)

[![](/img/2011-05-android-slidingdrawerwrapcontent_2.png)](/img/2011-05-android-slidingdrawerwrapcontent_2.png)

2\. ドロワーを開くと、スクロールするビューのスクロールバーがずれています。つまり、ドロワーで隠れてしまった部分を下方にスクロールすることで表示できます。

[![](/img/2011-05-android-slidingdrawerwrapcontent_3.png)](/img/2011-05-android-slidingdrawerwrapcontent_3.png)

3\. 実際、最下部までスクロールできます。(「終わり」という部分です。)

[![](/img/2011-05-android-slidingdrawerwrapcontent_4.png)](/img/2011-05-android-slidingdrawerwrapcontent_4.png)

4\. ドロワーを閉じると、スクロールビューが元のサイズに戻ります。

一見するとごく普通の動きで、Gmailのアプリでもメールのチェックボックスにチェックをつけるとドロワーが現れ、同様の動きをします。

Gmailやspモードメールのアプリの動作を見て、これはSlidingDrawerを使っているのだろう、とあたりをつけた所までは良かったのですが、これを実現するのにかなり苦労してしまいました。

**問題1**

まずSlidingDrawerをよくあるサンプルの通りに作成し、SlidingDrawerのサイズをコンテンツ(上記でいうダミーボタン)のサイズに合わせるためにandroid:layout\_height="wrap\_content"を指定します。

[![](/img/2011-05-android-slidingdrawerwrapcontent_5.png)](/img/2011-05-android-slidingdrawerwrapcontent_5.png)

1\. ドロワーが閉じているにもかかわらず、スクロールビューが非表示になっています。(ドロワーが画面一杯に広がってしまっています。)

[![](/img/2011-05-android-slidingdrawerwrapcontent_6.png)](/img/2011-05-android-slidingdrawerwrapcontent_6.png)

2\. ドロワーを開くと、画面一杯にドロワーが開いてしまいます。

**問題2**

wrap\_contentが効かないので、固定値で100dpと指定してみます。

[![](/img/2011-05-android-slidingdrawerwrapcontent_7.png)](/img/2011-05-android-slidingdrawerwrapcontent_7.png)

1\. ドロワーを開くと、とりあえずはうまくいっているように見えます。ただ、SlidingDrawerに含めるコンテンツに合わせて100dpの値を調整することになるのであまり良いやり方ではありません。

[![](/img/2011-05-android-slidingdrawerwrapcontent_8.png)](/img/2011-05-android-slidingdrawerwrapcontent_8.png)

2\. しかも、ドロワーが閉じていても100dp分の空きスペースができてしまいます。

**問題3**

stackoverflowのQ&Aに、wrap\_contentを有効にする方法がありました。

SlidingDrawerのラッパーを使い、wrap\_contentが有効になるようにonMeasure()をオーバーライドする、ということのようです。

[Android: can height of SlidingDrawer be set with wrap\_content? - stackoverflow](http://stackoverflow.com/questions/3654492/android-can-height-of-slidingdrawer-be-set-with-wrap-content/4265553#4265553)

[![](/img/2011-05-android-slidingdrawerwrapcontent_9.png)](/img/2011-05-android-slidingdrawerwrapcontent_9.png)

1\. このラッパーを使うことでwrap\_contentが効きました。調度よいサイズでドロワーがレイアウトされているようです。

[![](/img/2011-05-android-slidingdrawerwrapcontent_10.png)](/img/2011-05-android-slidingdrawerwrapcontent_10.png)

2\. しかし、やはりドロワーが閉じている状態では空きスペースができてしまいます。

**問題4**

ドロワーが閉じている時は、ウィジェットのサイズを0にするように修正してみます。

[![](/img/2011-05-android-slidingdrawerwrapcontent_11.png)](/img/2011-05-android-slidingdrawerwrapcontent_11.png)

1\. ドロワーが閉じているときにスクロールビューがきちんと表示されました。

[![](/img/2011-05-android-slidingdrawerwrapcontent_12.png)](/img/2011-05-android-slidingdrawerwrapcontent_12.png)

2\. ドロワーを開くと、スクロールビューがレイアウト調整されて、隠れた部分がスクロールできるようになっているのがスクロールバーの位置からわかります。

[![](/img/2011-05-android-slidingdrawerwrapcontent_13.png)](/img/2011-05-android-slidingdrawerwrapcontent_13.png)

3\. 実際に隠れた部分を表示できました。これでやっと完成、と思いましたが…

[![](/img/2011-05-android-slidingdrawerwrapcontent_14.png)](/img/2011-05-android-slidingdrawerwrapcontent_14.png)

4\. ドロワーを閉じると空きスペースができてしまいます…

Android SDKのソースコードもざっと見てみましたが、どうやらドロワーが閉じたときは再レイアウトされないようです。ドロワーを閉じたとき(onDrawerClosed())にrequestLayout()を呼ぶようにしたところ、最初の完成イメージのようになりました。

**別の問題**

RelativeLayoutで、スクロールビューがドロワーの位置をandroid:layout\_aboveで指定しているために上記のような問題が起こります。これを外すと、スクロールビューのレイアウトはドロワーのレイアウトの影響を受けなくなります。

[![](/img/2011-05-android-slidingdrawerwrapcontent_15.png)](/img/2011-05-android-slidingdrawerwrapcontent_15.png)

1\. ドロワーが閉じているときに空きスペースができてしまうようなことはありません。

[![](/img/2011-05-android-slidingdrawerwrapcontent_16.png)](/img/2011-05-android-slidingdrawerwrapcontent_16.png)

2\. その代わり、ドロワーが表示されるとドロワーで隠れた部分を見ることができなくなります。
