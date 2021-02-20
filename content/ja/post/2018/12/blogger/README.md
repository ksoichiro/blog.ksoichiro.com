---
title: "Blogger 高速化"
createdAt: 2018-12-30T23:46:00.001+09:00
tags: ["Blogger"]
---
自分で構築すればもっとシンプルで楽にできるのかもしれないが、長らくこのドメインでやってきていることもあり Blogger を続けようと思っている。
ただ、Blogger の「テンプレート」にはいろいろムダなものが入っていて、ページの表示が遅かったりする。ブログ再開を機に更新することにした。

Lighthouse の Chrome Extension での計測で、以下のように改善。

| 項目 | 変更前 | 変更後 |
| ---- | ---- | ---- |
| Performance | 75 | 90 |
| Progressive Web App | 58 |  |
| Accessibility | 44 | 65 |
| Best Practices  | 79 | 93 |
| SEO | 100 | 100 |

[PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/) だとモバイルが 91 点、PC が 100 点に改善した。

実際に表示した場合のあるときの数値は
69 リクエスト、652 KB、5.9 秒から
38 リクエスト、325 KB、3.1 秒に改善 (ばらつきはある)。

以下では、その改善のための変更内容について説明。
<!--more-->
## 共有ボタンを消す

Blogger 特有のメール/Blog this!/Facebook/Twitter/Google+のボタンのセットは、シンプルに見えて意外に時間がかかっているようだったため、思い切って除去してみた。これで 59 リクエスト、624KB、4.1秒に削減。

## +1ボタンの廃止

Google+ の +1 のボタン。Google+ も終了することだし、なくなっても良いだろうと考えた。
特に、plusone.js という JavaScript がパフォーマンスに悪影響を及ぼしているようで、テンプレートが実際の HTML に展開されるときに埋め込まれる。
これを削除するには、以下のようなコードを削除し(`&lt;` などは誤りではなく、実際そのように埋め込まれている)、

```html
&lt;script type=&quot;text/javascript&quot; src=&quot;https://apis.google.com/js/plusone.js&quot;&gt;&lt;/script&gt;
```

以下のように `<body>` の閉じタグを記述する。
いくつかのブログで見かけたが、おそらく Blogger が `</body>` を検出して何かしようとしているのをごまかしているのだろう。

```html
&lt;!--</body>--&gt; &lt;/body&gt;
```

これで 40 リクエスト、358 KB、 3.8 秒まで減った。

ここでもう一度 Lighthouse で計測すると Performance が 88 まで改善した。

ここからしばらくは、改善項目として挙げられていたものへの対処。
速度に影響するものもあるが、途中から面倒になり計測していなかった…。

## 他ドメインを target=”\_blank” で開く場合の noopener の付与

開いたページを切り離して動作させるために `rel="noopener"` を付与する。
以下参考。

[サイトで rel=”noopener” を使用して外部アンカーを開く](https://developers.google.com/web/tools/lighthouse/audits/noopener?hl=ja)

フッター部の Powered by Blogger のリンクが曲者。
Blogger が生成しているコードのため、単純には手を入れられない。
`<body>` の閉じタグの前に以下を追加。
これで動作するかどうかはブログの構成によるだろう。

```html
<script type='text/javascript'>
  $('#Attribution1 a[target="_blank"]').attr('rel', 'noopener');
</script>
```

## jQuery のアップデート

古い、脆弱性のあるバージョン(1.8.3)を使っていたため、今のところ問題の出ていない 3.3.1 にアップデート。

なお、ページ内でこの jQuery に依存する JavaScript がある場合、上記のような大幅なアップデートで動かなくなるものがある可能性もあるので注意が必要。

## html タグへの lang 属性の指定

Accessibility の項目。
`<html>` タグに `lang='ja'` を追加。

## meta タグの max-scale 値を除去

これも Accessibility の項目。単純に削除。

```diff
-      <meta content='width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0' name='viewport'/>i
+      <meta content='width=device-width,initial-scale=1.0,minimum-scale=1.0' name='viewport'/>
```

## 色のコントラストの調整

文字と背景のコントラストの差が小さいと、Accessiblity の観点ではよろしくない。
以下で確認しながら色を調整。

[Text elements must have sufficient color contrast against the background](https://dequeuniversity.com/rules/axe/2.2/color-contrast?application=lighthouse)

## 最近の投稿の削除

このブログのフィードを解析して最近の投稿を表示するようなウィジェットを追加していたが、これが遅さの原因のようだったため、思い切って一旦削除。

## http/https の混在しているものを修正

`http://` と書かれているものを `//` に修正し、アクセスしたプロトコルに応じて変更するようにした。一応、どちらでも各リソースがアクセスできることは確認しておく。

## skin の中の CSS を外部 CSS ファイルに移動

テンプレートのデザインの根幹部分のはずだが、ここには変数の定義が書かれていて、変数を使ったスタイルが定義されている。実際にアクセスして出力されている CSS を別の CSS ファイルに移し、この領域は空にした。

```xml
    <b:skin><![CDATA[
]]></b:skin>
    <b:template-skin>
      <![CDATA[
      ]]>
    </b:template-skin>
```

なお、外部 CSS は minify しておく。
当初、外部ウェブサイトで CSS を minify していたが、スタイルが想定外に崩れてしまっていたため、テンプレート、CSS 等を管理する [Git リポジトリ](https://github.com/ksoichiro/memorandum) を用意して npm を導入し、 [clean-css-cli](https://github.com/jakubpawlowicz/clean-css-cli) で minify するようにした。

また、いきなり Blogger のテンプレートを変更して本番反映するのも避けたかったので、 npm の導入したので [local-web-server](https://github.com/lwsjs/local-web-server) を使い、HTML をローカルで動作確認してから反映するようにした。

## 一部のスタイルをインライン化

スタイルを外部 CSS に移動させてしまった結果、ページ表示の初期段階ではスタイルなしの状態になってしまうため、初期表示の見た目に大きく影響するようなスタイルを抽出して HTML ファイル内部に埋め込んだ。

埋め込む際には、minify してから埋め込む。

このためのツールもありそうだが、今回は inline.css というファイルを作ってローカルで少しずつ移して動作確認し、できてきたら clean-css-cli で minify してから以下のように外部 CSS の読み込みの前に埋め込むようにした。

```html
<style>body{background:#c5eaf7;font:normal normal 12px Arial...(略)</style>
<link as='style' href='//ksoichiro.github.io/memorandum/memorandum.min.css' onload='this.rel=&apos;stylesheet&apos;' rel='preload'/>
```

## Quick Edit の削除

自分で表示した場合に出てくる、編集用のアイコンは不要なため削除。
(これはあまり Lighthouse に関係ないが)

以下の記述を削除することで反映。

```xml
<b:include name='quickedit'/>
```

```xml
<b:include data='post' name='postQuickEdit'/>
```

改善は以上。
