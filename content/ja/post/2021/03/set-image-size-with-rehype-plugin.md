---
title: rehype plugin で image のサイズを設定する
tags: ["rehype", "nuxt/content", "Lighthouse"]
---
Lighthouse の監査項目に `Image elements have explicit width and height` というものがある。
[Images without dimensions](https://web.dev/optimize-cls/#images-without-dimensions) で詳しく説明されているが、`<img>` タグに `width`、`height` 属性を設定するようにすることで CLS (Cumulative Layout Shift) を改善することができる。

ところが nuxt/content においては、画像を `![](URL)` で埋め込んだ場合にこれらが自動的には設定されないようだったため、[rehype](https://github.com/rehypejs/rehype) の plugin として [rehype-img-size](https://github.com/ksoichiro/rehype-img-size) を作って自動的に画像サイズを読み取り設定してくれるようにした。
<!--more-->
## plugin でどのように解決するか

SSG で事前にページをビルドする前提であればローカルのファイルシステムに直接アクセスすることもできるため、 Markdown から変換された HTML を rehype で操作して、`<img>` の `src` 属性に設定されたファイルのサイズを読み取って `width` と `height` を設定することができる。

これに加えて CSS で以下のように設定すれば、画像サイズが大きくてもはみ出すことがないので、画像ごとに個別にサイズを調べて `<img width="...">` と書き直したりせずに楽に対処することができる。

```css
p img {
  max-width: 100%;
  height: 100%;
}
```

## 使い方

rehype-img-size の README にも書いているが、まずはインストール。

```
npm install rehype-img-size
```

以下のような Markdown があり、

```markdown
![](img.png)
```

以下のような `example.js` があるとする。

```js
const unified = require('unified')
const parse = require('remark-parse')
const remark2rehype = require('remark-rehype')
const stringify = require('rehype-stringify')
const vfile = require('to-vfile')
const rehypeImgSize = require('rehype-img-size')

unified()
  .use(parse)
  .use(remark2rehype)
  .use(rehypeImgSize)
  .use(stringify)
  .process(vfile.readSync('index.md'), function(err, file) {
    if (err) throw err
    console.log(file.contents)
  })
```

すると、`node example` で以下のように `width`、`height` の属性を付加して出力することができる。

```html
<p><img src="img.png" alt="" width="640" height="480"></p>
```

以上が rehype plugin としての使い方だが、これを nuxt/content で使う場合は `nuxt.config.js` の `content.markdown.rehypePlugins` に追加するだけでいい。

```js
export default {
  content: {
    markdown: {
      rehypePlugins: [
        [ 'rehype-img-size', { dir: 'static' } ]
      ]
    }
  }
}
```

nuxt/content のデフォルトでは `static` ディレクトリが静的ファイルの配置場所となっているため、Markdown ファイルの配置場所である `content` ディレクトリにある Markdown ファイルに公開時のパスが書かれていると、そのパスからファイルを直接開くことができない。
このため、静的ファイルの配置場所を `dir` オプションで指定している。

こうすると、例えば `![](/image.png)` のように書かれた画像ファイルは `./static/image.png` と解釈されて読み込むことができる。

これを適用することで、このブログでは `Image elements have explicit width and height` の監査項目を pass することができた。

## plugin をどうやって作ったか

nuxt/content のドキュメントの序盤にある [Writing content](https://content.nuxtjs.org/writing) などを読むと remark や rehype への言及があり、これらが使えそうだなというのは想像しやすい。

それで [rehype plugin の一覧](https://github.com/rehypejs/rehype/blob/main/doc/plugins.md)に適したものがないかと探したのだが、見つからなかった。[rehype-resolution](https://github.com/michaelnisi/rehype-resolution) は非常に近い内容だが、これは `srcset` を設定するもので今回の要件にはマッチしなかった。

このページの下の方に `Create plugins` という説明があり、そこからリンクされている [Creating a plugin with unified](https://unifiedjs.com/learn/guide/create-a-plugin/) の説明を読むと作り方がわかりやすい。たくさんの API を理解しないといけないと思ったがそんなことはなく、基本的には AST を受け取って必要な処理を書けば良い。この AST は [hast](https://github.com/syntax-tree/hast) という HTML の syntax tree で、さらに抽象化された [unist](https://github.com/syntax-tree/unist) 向けに用意された `unist-util-visit` を使うことで、以下のような少ないコードでノードに対する処理を書き始めることができる。

```js
const visit = require('unist-util-visit')

module.exports = attacher

function attacher(options) {
  function transformer(tree, file) {
    visit(tree, 'element', visitor)

    function visitor(node) {
      // node を使った処理
    }
  }
}
```
