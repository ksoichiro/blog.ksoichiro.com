---
title: "Android ActionBarCompatでAndroid 2.xでもタブ+Fragmentを使う時にアクションボタンが切り替わるようにする"
created: 2012-11-25T00:58:00.003+09:00
tags: ["Fragment","ActionBarCompat","Android"]
---
Android SDKに付属しているサンプルのActionBarCompatを少しだけ改良した ActionBarCompatRevというライブラリを作りました。
[ActionBarCompatRev](https://bitbucket.org/ksoichiro/actionbarcompatrev/overview)
<!--more-->
ActionBarを使ったスタイルはAndroid 3.0以降で利用できますが、
実際にアプリ開発をするとなると、まだまだAndroid 2.3などの下位バージョンを
考慮する必要があり、デザイン・仕様を共通化するために前述のActionBarCompatなどを
使う必要があります。
もちろん、既にActionBarSherlockのような非常に高機能なライブラリも出ていますが
高機能ゆえにサイズも大きい、もしバグ(もしくは期待しない挙動)があったときに手を入れるのが難しい、など採用しにくいケースもあると思います。

そこで、規模が小さく内容を把握しやすいActionBarCompatを使おうと思ったのですが、問題だったのが、Tabを使ったレイアウトだとAndroid 2.xで動かした時に、タブ(=Fragment)を切り替えてもアクションボタンが切り替わらないということです。

ActionBarCompatのソースコードを読んでいくと、Fragmentのメニュー(onCreateOptionsMenu())が呼び出されるのはActivityが切り替わったタイミングだということが分かります。
なので、タブを使う場合のように1つのActivityの中で複数のFragmentが切り替わっていくパターンではFragmentごとにメニューを読み込んでくれません。

冒頭に書いたライブラリは、ActionBarCompatのこの点を改良したものです。
ライブラリを使ったサンプルを付けていますので、同じような問題に遭遇した方はお試しいただければと思います。

使うには、まずこのライブラリをAndroid Library Projectとして組込みます。

そして、タブを持つActivityはこのライブラリのActionBarFragmentActivityを、タブになるFragmentはActionBarFragmentをextendsします。

Fragmentの扱い方ではひとつだけ注意点があります。以下のように、menuを作ってからsuperのメソッドを呼ぶ必要があります。

```java
public void onCreateOptionsMenu(final Menu menu, final MenuInflater inflater) {
    inflater.inflate(R.menu.fragment_tab1, menu);
    super.onCreateOptionsMenu(menu, inflater);
} 
```

あとは、Honeycomb以降でのFragmentを使うタブの扱い方と同様です。

EclairからJelly Beanまで動作を確認しています(エミュレータですが)。

Eclair

[![](http://2.bp.blogspot.com/-bRbz8R9fgjQ/ULDseWP7QDI/AAAAAAAAKXA/5yfMaxMGzO4/s320/ActionBarCompatRev_Sample_Eclair.png)](http://2.bp.blogspot.com/-bRbz8R9fgjQ/ULDseWP7QDI/AAAAAAAAKXA/5yfMaxMGzO4/s1600/ActionBarCompatRev_Sample_Eclair.png)

Froyo

[![](http://4.bp.blogspot.com/-MJ49qFMOVto/ULDsfHpEupI/AAAAAAAAKXI/o-yEcUz2xW0/s320/ActionBarCompatRev_Sample_Froyo.png)](http://4.bp.blogspot.com/-MJ49qFMOVto/ULDsfHpEupI/AAAAAAAAKXI/o-yEcUz2xW0/s1600/ActionBarCompatRev_Sample_Froyo.png)

Gingerbread

[![](http://2.bp.blogspot.com/-FJ8aHncM1k4/ULDsfz_q-lI/AAAAAAAAKXQ/YoSoeObz0E8/s320/ActionBarCompatRev_Sample_Gingerbread.png)](http://2.bp.blogspot.com/-FJ8aHncM1k4/ULDsfz_q-lI/AAAAAAAAKXQ/YoSoeObz0E8/s1600/ActionBarCompatRev_Sample_Gingerbread.png)

Honeycomb

[![](http://3.bp.blogspot.com/-BbqOa0NCIeE/ULDsguU3EHI/AAAAAAAAKXY/KBISFg3bFVA/s320/ActionBarCompatRev_Sample_Honeycomb.png)](http://3.bp.blogspot.com/-BbqOa0NCIeE/ULDsguU3EHI/AAAAAAAAKXY/KBISFg3bFVA/s1600/ActionBarCompatRev_Sample_Honeycomb.png)

Ice Cream Sandwich

[![](http://3.bp.blogspot.com/-WmzZjyqHvpg/ULDshMDwb1I/AAAAAAAAKXg/gLVQHe69yBg/s320/ActionBarCompatRev_Sample_ICS.png)](http://3.bp.blogspot.com/-WmzZjyqHvpg/ULDshMDwb1I/AAAAAAAAKXg/gLVQHe69yBg/s1600/ActionBarCompatRev_Sample_ICS.png)

Jelly Bean

[![](http://4.bp.blogspot.com/-EUoaTAZnAzw/ULDsh9Kap9I/AAAAAAAAKXo/6A_WDG-075A/s320/ActionBarCompatRev_Sample_JellyBean.png)](http://4.bp.blogspot.com/-EUoaTAZnAzw/ULDsh9Kap9I/AAAAAAAAKXo/6A_WDG-075A/s1600/ActionBarCompatRev_Sample_JellyBean.png)
