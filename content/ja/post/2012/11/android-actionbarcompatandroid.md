---
title: "Android ActionBarCompatでAndroid 2.xでもタブ+Fragmentを使う時にアクションボタンが切り替わるようにする"
noEnglish: true
originalCreatedAt: 2012-11-25T00:58:00.003+09:00
tags: ["Fragment","ActionBarCompat","Android"]
---
Android SDKに付属しているサンプルのActionBarCompatを少しだけ改良した ActionBarCompatRevというライブラリを作りました。
[ActionBarCompatRev](https://bitbucket.org/ksoichiro/actionbarcompatrev/overview)
<!--more-->
ActionBarを使ったスタイルはAndroid 3.0以降で利用できますが、
実際にアプリ開発をするとなると、まだまだAndroid 2.3などの下位バージョンを考慮する必要があり、デザイン・仕様を共通化するために前述のActionBarCompatなどを使う必要があります。
もちろん、既にActionBarSherlockのような非常に高機能なライブラリも出ていますが高機能ゆえにサイズも大きい、もしバグ(もしくは期待しない挙動)があったときに手を入れるのが難しい、など採用しにくいケースもあると思います。

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

[![](/img/2012-11-android-actionbarcompatandroid_1.png)](/img/2012-11-android-actionbarcompatandroid_1.png)

Froyo

[![](/img/2012-11-android-actionbarcompatandroid_2.png)](/img/2012-11-android-actionbarcompatandroid_2.png)

Gingerbread

[![](/img/2012-11-android-actionbarcompatandroid_3.png)](/img/2012-11-android-actionbarcompatandroid_3.png)

Honeycomb

[![](/img/2012-11-android-actionbarcompatandroid_4.png)](/img/2012-11-android-actionbarcompatandroid_4.png)

Ice Cream Sandwich

[![](/img/2012-11-android-actionbarcompatandroid_5.png)](/img/2012-11-android-actionbarcompatandroid_5.png)

Jelly Bean

[![](/img/2012-11-android-actionbarcompatandroid_6.png)](/img/2012-11-android-actionbarcompatandroid_6.png)
