---
title: nuxt/content のブログを full-static にする
tags: ["nuxt/content", "Nuxt.js", "Lighthouse", "PageSpeed Insight"]
---
![](/img/2021-03-make-blog-full-static_1.png)

[nuxt/content でブログを作ってきた](/ja/post/2021/03/migrate-blog-to-nuxt-content3/)が、 Lighthouse (あるいは PageSpeed Insight) での計測において Performance が 80 点前後から向上させられていなかった。
TTB (Total Blocking Time) の項目が悪く、 JavaScript のロードに時間がかかっているらしいことはわかったのだが、これに対処することで Performance 100 点まで上げることができた。
<!--more-->
## JavaScript の inject を無効にする

`nuxt.config.js` で `build.analyze` を `true` にしてファイルの大きさを確認してみたりもしたのだが、特に削減できそうなものが見当たらない。
Nuxt.js の static ビルドにおいてそういった問題があるのかどうか探していたところ、以下のような issue を見つけた。
[Lots of unnecessary JavaScript in generated Nuxt static build #5260](https://github.com/nuxt/nuxt.js/issues/5260)

その中で、[`render.injectScripts` を `false` にすると JavaScript を完全になくせるというコメント](https://github.com/nuxt/nuxt.js/issues/5260#issuecomment-787722343)を読んで、その通りに試してみたところ絶大な効果だった。
Web フォントのロードや firebase-analytics のロードも気になっていたのだが、これらを残したままでも一気に Performance が 100 点まで上がった。

これにより一部の JavaScript の埋め込みがなくなっていて大幅に速くなったのだが、どうやら自分で追加した一部の機能が動かなくなってしまっているということに気づいた。
client side で動かす JavaScript が無効化されてしまっているようだった。
Nuxt.js v2.14 (現時点での最新である v2.15.3 も同様だった) の時点では `target: static` での `nuxt generate` は完全な static build ではないらしいということをようやく理解した。

動作しなくなっていたのは以下のような機能で、いずれも `@click` でクリックのイベントに対する処理を実装していた。

- モバイル向けの表示で、ハンバーガーメニューが反応しなくなっていた
- 過去の投稿の一覧をクリックで展開できるリストにしている部分で、キャレットをクリックしても展開できなくなっていた
- ページネーションのリンクが反応しなくなっていた

なお、開発向けの動作としてはホットリロードやその場での編集もできなくなる模様。

上記の issue コメントで書かれている pending された PR というのがどれを指すのかわからなかったが、近い将来には対応されるはず。とはいえ、full-static であるということは結局同じ動作になってしまうのだろうと諦めて、これらを Vue.js に頼らず生の JavaScript で記述して埋め込むことを考えた。

`render.injectScripts` を使わずに client side の JavaScript だけは動作させるような方法がないかというのも探したが、 [Preload tag still added with injectScripts:false & resourceHints:false #8178](https://github.com/nuxt/nuxt.js/issues/8178) のように生成された script を削除する方法が見つかっただけで、これではうまくいかなかったのでこれも諦めた。

結果的に上記の 3 点を実装することで対処した。

このブログの現時点での該当機能がこの 3 点というだけであって、汎用的に使えるソリューションではないが、まとめておく。

## ハンバーガーメニュー

これは簡単で、ハンバーガーメニューの要素をクリックするイベントハンドラを登録しておいて、CSS のクラスをトグルすれば良い。

`@click` で設定されている method を外す。

```html
<div class="menu" @click="toggleMenu">
  <div class="bar1" />
  <div class="bar2" />
  <div class="bar3" />
```

代わりに `document.getElementById` で識別するための `id` を埋め込む。

```html
<div id="toggleMenu" class="menu">
  <div class="bar1" />
  <div class="bar2" />
  <div class="bar3" />
```

以下のように data の field をトグルしているコードは削除してしまう。

```vue
<template>
  <div id="nav" :class="{'is-open': isMenuOpen }">
  <!-- ... -->
</template>

<script>
export default {
  data () {
    return {
      isMenuOpen: false
    }
  },
  methods: {
    toggleMenu () {
      this.isMenuOpen = !this.isMenuOpen
    }
  }
  // ...
}
```

この `toggleMenu` を使った JavaScript はナビゲーションバーの Component に書くのが良いかもしれないが、ハンバーガーメニューを含んでいるナビゲーションバーは全ページで使われるので今回は `nuxt.config.js` に埋め込んだ。
このコードを minify するなどの最適化をしても良いかもしれないが、そこまでパフォーマンスに影響するようには思えなかったのでこのままにしている。

```js:nuxt.config.js
export default {
  // ...
  head: {
    // ...
    script: [
      {
        innerHTML: `
          (function(d) {
            d.addEventListener('DOMContentLoaded', function() {
              d.getElementById('toggleMenu').addEventListener('click', function() {
                d.getElementById('nav').classList.toggle('is-open');
              });
            });
          })(document);
        `
      },
      // ...
    ],
    __dangerouslyDisableSanitizers: ['script'],
```

キャレットの展開は...ハンバーガーメニューと同様にフラグの操作をするだけなので割愛する。

## ページネーション

ページネーションは基本的に以下の方法で実現できる。
https://qiita.com/the_fukui/items/a103ff12644457ac4eec

同じ SSG である Hugo のページネーションも同じアプローチをとっていて、ページごとにパスを割り当てているようなので、問題はなさそう。
https://gohugo.io/templates/pagination/#additional-information

SSG であるために注意しなければならないのは、存在しないページへのリンクは無効化しておかないと `nuxt generate` で無限にページを辿って route を生成してしまったり、 `Error generating route` というエラーが大量に出てしまったりするという点。
特にこのブログでは日本語と英語のページを切り替えられるようにしているため、例えば 10 ページ目は日本語には存在するが英語には存在しない、というケースがある。

当初は、日英の切り替えリンクを無効化せず、存在しないページを表示したらトップページにリダイレクトするように実装した。

```js
async asyncData ({ app, $content, params, redirect }) {
  // ...
  const perPage = process.env.perPage
  const maxPage = Math.ceil(pages.length / perPage)
  if (page < 1 || maxPage < page) {
    return redirect(302, app.localePath('/'))
  }
```

これは一見動作するように思えるのだが、実際に `nuxt generate && firebase serve` で動かしてみると、存在しない英語ページに切り替えたときに、HTTP 200 で内容のないページを返すような挙動になった。

なぜリダイレクトしてくれないのかはわからなかったが、どうやら、404 エラーなどを返すようにしないと route 自体は有効とみなされてしまい、実行時に正常にレスポンスを返してしまうようだった。
日英ともに存在しないページにアクセスした場合には 404 を返していた。

そこで、トップページの `asyncData` では日英両方の最大ページ数をチェックして、英語のページが存在しなければ英語への切り替えリンクを生成しないように修正した。
`asyncData` は `nuxt generate` の実行時にしか実行されず、大量にデータを読み込んだとしてもページ読み込み時のパフォーマンスには影響しないため、問題はない。

これでめでたく Performance は 100 点になった！ :tada:
