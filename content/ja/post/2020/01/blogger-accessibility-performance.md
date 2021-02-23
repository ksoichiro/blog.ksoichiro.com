---
title: "Blogger Accessibility Performance改善"
originalCreatedAt: 2020-01-13T16:19:00.001+09:00
tags: ["Blogger"]
---
以前改善してからまた時間がたったので、改めてLighthouseの点数改善にチャレンジ。

なお、Chromeでログインして拡張機能でLighthouseを使っている場合、シークレットウィンドウからの実行を許可した上でシークレットウィンドウから実行しないと、キャッシュが使われてしまい正しい結果が出ない。

lighthouse の npm コマンドで実行するのが無難。
<!--more-->
## Accessibility: selectにlabelがついてない

このブログには上部に blog apps github というリンクがあり、モバイルの場合は select になっている。ここに label が設定されていないというもの。

これは単に対象の select に title=‘Category’ と付与することで解決した。

## Accessibility: iframe に title がついていない

BloggerのテーマのHTMLを"iframe"で検索したところ、コメントフォームにiframeがあった。

title='comment-editor’を埋め込んで対応。

## Accessibility: imageにaltがない

class `mobile-index-thumbnail` に該当のものがあった。alt=’'を設定して解決。

これでついに Acccessibility が 100 点になった。

## Performance: Bloggerアイコンのcache

めったに変わるものでもないのでbase64化して埋め込みするのが良さそう。

Font Awesomeのアイコンなどでも良かったが、ロゴアイコンなので一応配慮してBloggerのものを使うことにした。

```html
<li><a class='profile-name-link g-profile' expr:href='data:i.userUrl' expr:style='&quot;background-image: url(&quot; + data:i.profileLogo + &quot;);&quot;'><data:i.display-name/></a></li>
```

これを以下に変更。

```html
<li><a class='profile-name-link g-profile' expr:href='data:i.userUrl' expr:style='&quot;background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA3klEQVQ4y2P4l8YUCsT/ycT6DBRoBmNMA5IZ/v+LB+IYKI5lgIgRZUACUOH2jv//3j/5/+//fwj+8/P/vyNz/v8rliRgQDJUM0jTv39oGCh2ceP/f0kMeAwAORtkM0gDyJBzqyEYZiCILpXCYwDIvzDF1/YAFUtCMIgNM2BVyf9/hWJEGPD3LyIMQGx0sRgGEgxAN4goA2BeqJCDYHSvYDUAWyCCQh6EkQPz08v//+IYSI3GfwiD58cTSEggBSBb0MMAJAaSS2AgkJRBOA4pKcNwHAOReYGMzKRPgQEGAIvy2M2lOZIeAAAAAElFTkSuQmCC);&quot;'><data:i.display-name/></a></li>
```

もう一つ。

```html
<a class='profile-name-link g-profile' expr:href='data:userUrl' expr:style='&quot;background-image: url(&quot; + data:profileLogo + &quot;);&quot;' rel='author'>
```

これを以下に変更。

```html
<a class='profile-name-link g-profile' expr:href='data:userUrl' expr:style='&quot;background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA3klEQVQ4y2P4l8YUCsT/ycT6DBRoBmNMA5IZ/v+LB+IYKI5lgIgRZUACUOH2jv//3j/5/+//fwj+8/P/vyNz/v8rliRgQDJUM0jTv39oGCh2ceP/f0kMeAwAORtkM0gDyJBzqyEYZiCILpXCYwDIvzDF1/YAFUtCMIgNM2BVyf9/hWJEGPD3LyIMQGx0sRgGEgxAN4goA2BeqJCDYHSvYDUAWyCCQh6EkQPz08v//+IYSI3GfwiD58cTSEggBSBb0MMAJAaSS2AgkJRBOA4pKcNwHAOReYGMzKRPgQEGAIvy2M2lOZIeAAAAAElFTkSuQmCC);&quot;' rel='author'>
```

## Webフォントの読み込みが遅い

単に link タグで貼り付けていたものを、こちらを参考に非同期化する。: [https://hail2u.net/blog/webdesign/async-web-font-loader.html](https://hail2u.net/blog/webdesign/async-web-font-loader.html)

さらに Lato は利用を諦めて Noto Sans JP のみにした。

Web フォントのロード中にも文字が描画されるように、display=swap をつけておく。

```javascript
<script>(function (d, f) {
  var l = d.createElement('link');
  l.rel = 'stylesheet';
  l.href = f;
  var s = d.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(l, s);
})(document, 'https://fonts.googleapis.com/css?family=Noto+Sans+JP:400,700&display=swap');
</script>
```

## widget\_css\_mobile\_2\_bundle.cssの読み込みが遅い

こちらを参考に無効化してみる: [http://blogger.weblix.net/2013/02/blogger-remove-bundle-css.html](http://blogger.weblix.net/2013/02/blogger-remove-bundle-css.html)

```html
    <b:skin><![CDATA[
]]></b:skin>
```

これを以下のようにする。

```html
&lt;style type=&quot;text/css&quot;&gt;
&lt;!-- /*<b:skin><![CDATA[*/]]></b:skin>
```

うまくいかない…

今度はこちらを参考に: [http://holidaybuggy.blogspot.com/2017/03/bloggerbundlecss.html](http://holidaybuggy.blogspot.com/2017/03/bloggerbundlecss.html)

こちらは成功。だいぶ点数が改善した。

authorization.cssは空のようだったので省いている。

また、若干文法エラーがあったので修正している。

```html
<b:if cond='data:blog.isMobile’>
<!--モバイル環境の場合-->
<style type='text/css’>
//*-widget_css_mobile_2_bundle.cssの内容
</style>
<b:else/>
<!--PC環境の場合-->
<style type='text/css’>
//*-css_bundle_v2.cssの内容
</style>
</b:if>
```

## 人気の投稿のサムネイル画像の読み込みが遅い

`img` に `decoding="async"` を付与する。

```html
<b:with value='data:post.featuredImage.isResizable ? resizeImage(data:post.featuredImage, 72, &quot;1:1&quot;) : data:post.thumbnail' var='image'>
  <img alt='' decoding='async' border='0' expr:src='data:image'/>
```

以上でほぼ満点となった！

![](/img/2020-01-blogger-accessibility-performance_1.png)
