---
title: ブログを nuxt/content に移行 - 3. 一覧が遅すぎる問題、そして nuxt/content へ切り替え
tags: ["Blogger", "VuePress", "nuxt/content"]
---
[ブログをnuxt/contentに移行 - 2. descriptionの自動生成](/ja/post/2021/03/migrate-blog-to-nuxt-content2/) の続き。
やっと過去の投稿を移行して Blogger のような一覧表示ができたので PageSpeed Insight でパフォーマンスをチェックしたところ、なんと33点。
トップページでの各記事の一覧/前半のHTMLを `v-html` + `ClientOnly` でレンダリングしているせいか、DCL (DOMContentLoaded) や LCP (Largest Contentful Paint) がすごく遅くなっている模様。
CLS (Cumulative Layout Shift) も大きく、後からコンテンツを表示しているせいでずれが起きていそうだ。

VuePress に関連する話題はないだろうかと探したが、解決策は見つからない。
上記のようなケースを含めていわゆる SSG ができるものでないと厳しそう。

その中で nuxt/content を使っている例をいくつか見かけ、ちょっと試してみたらすごく良かったので、主要な機能を検証した上で切り替えていった。
<!--more-->
ページ一覧があって、ページの要約があって、ページングができて…という感じのものを SSG でできるかどうかを確認した。
VuePress の場合に自前で実装した `<!--more-->` の記法もサポートされていて、これを description として扱ってくれる[^1]ので、比較的簡単に実現できそうだった。

変更の commit log を追いながら説明できることは多々あるのだが、重要な部分をかいつまんで書いておく。

## すべて静的に生成できるか

Vue.js や VuePress を試していたこともあってか、[nuxt/content](https://content.nuxtjs.org/ja) の冒頭で説明されているチュートリアル的な説明で、簡単に動かしてみることができた。
VuePress とはだいぶ構成も違うので、いきなり切り替えようとせずに、1からインストールして組み立てながら主要なパーツを組み立てて検証していった。

細かい部分をさておいて一番重要なのが、VuePress で問題になっていた、加工したコンテンツを表示しても静的なページとして生成できるかどうかという点。
Blogger のように一覧ページ上で各エントリの冒頭部分が表示されるのは維持したかったので、前述の `<!--more-->` による description 生成を活用したかったが、description は HTML としての表示には使えなかった。

そこで見つけたのが `excerpt` だった。
これは `<!--more-->` を使って作られた要約だが、description のようなテキストではなく、JSON AST になっているようだった[^2]。
これを、通常の Markdown の表示と同じように `<nuxt-content>` にわたすことで要約部分を HTML として表示することができた。

```html
<nuxt-content :document="{body: post.excerpt}" />
```

そしてこれは `nuxt generate` で生成すると HTML に静的に出力できた :tada:

この `excerpt` だと実は `<!--more-->` がない記事では値が空になり一覧上にコンテンツが表示されなくなってしまうのだが、これに対しては `<!--more-->` が存在しないファイルに対して以下のコマンドで `<!--more-->` を一括追記することで対処した。

```bash
for i in $(rg '<!--more-->' --files-without-match content); do echo '<!--more-->' >> $i; done
```

チュートリアルで理解した基本的な機能とこれができたことで、nuxt/content に移行して問題ないだろうという気持ちになっていたが、さらに検証を進めていった。

## パス構成の維持

`/2021/02/slug` のようなパスを維持したかったため、これができるか確認した。
これは以下などを参考に構成できる。
https://qiita.com/125Dal/items/51c4c058256d6b349921#content

VuePress と違ったのは、`slug` の部分が `slug.md` でも `slug/README.md` でも良かったのに対して、 nuxt/content だと `slug.md` にしかできなかったということ。
これも同様にコマンドで一括変換した。

```bash
for i in $(rg "title:" --files-with-matches content/ja/post); do mv $i `dirname $i`.md; done
for i in $(rg "title:" --files-with-matches content/ja/post); do rmdir `echo -n $i | sed -e 's/.md//'`; done
```

`slug` のディレクトリ内に該当記事用の画像を格納している例があったが、これは共通の場所 (`static/`) に移動してリネームし、参照するURLを置き換える作業をした。(幸いまだ1ファイルしかなかった)

## 作成日時の変換

旧ブログから移行した旧記事については、`created` というヘッダを設定することで作成日時を表現していたが、これは nuxt/content では `createdAt` となるため置換した。ただしこれは後述の通り別名にすることになる。

```bash
rg "created:" --files-with-matches content | xargs sed -i '' -e "s/created:/createdAt:/g"
```

## git の日付による作成日時・更新日時の表現

VuePress では git の commit の日付を使って最終更新日時を表現している。
しかし、残念ながら nuxt/content は git の情報を見てくれないようだった。
VuePress では最終更新日時のほか、作成日時も同じ方法で git の履歴から取得するように plugin を実装していた[^3]が、これらを移行した。

`content:file:beforeInsert` の hook を使って対象ファイルの git log を確認し、ページのオブジェクトに `createdAt` のフィールドで設定するようにした。
ただ、これを正常に動作させるためには frontmatter に埋め込まれている `createdAt` を別名に変換しておく必要がある。この hook のタイミングでは、frontmatter の `createdAt` の有無によらずページのオブジェクトの `createdAt` は存在していて、これがファイルの作成日時を示すのか frontmatter に書かれていた値なのか区別ができないためだ。
frontmatter では `originalCreatedAt` という名前を使って作成日時を定義することにして、これがあればその値を尊重し、なければ git の履歴を辿ることにした。

```js
hooks: {
  'content:file:beforeInsert': (document) => {
    const filePath = 'content' + document.path + document.extension
    try {
      if (document.originalCreatedAt) {
        document.createdAt = document.originalCreatedAt
        delete document.originalCreatedAt
      } else {
        document.createdAt = parseInt(spawn.sync(
          'git',
          ['log', '-1', '--format=%at', '--follow', '--diff-filter=A', path.basename(filePath)],
          { cwd: path.dirname(filePath) }
        ).stdout.toString('utf-8')) * 1000
      }
    } catch (e) { /* do not handle for now */ }

    try {
      document.updatedAt = parseInt(spawn.sync(
        'git',
        ['log', '-1', '--format=%at', path.basename(filePath)],
        { cwd: path.dirname(filePath) }
      ).stdout.toString('utf-8')) * 1000
    } catch (e) { /* do not handle for now */ }
  },
```

## 言語の切り替え

そもそもブログを移行しようとしたきっかけが英語で書くことで、Blogger では難しく VuePress で簡単に実現できたからだったが、nuxt/content でも似た構成を取れるか確認した。

Markdown の構成としては以下のように単純に en/ja のディレクトリを作って格納する。

```
content/
  en/
    post/
      2021/
        01/
          post1.md
  ja/
    post/
      2021/
        01/
          post1.md
```

ページの描画については当初 pages 以下で en/ja それぞれのページを用意しようとしていたが、これは1つにまとめることができた。

nuxt-i18n を使うと、デフォルトのロケール(ここでは `en`)の場合に`/en/` のようなロケールを示すディレクトリを挟まない構成になる[^4]。

これによって現在表示しているページのロケールが何なのかは決まっているはず、ということになるが、これは `asyncData()` で `app.i18n.locale` で取得できた。

```js
async asyncData ({ app, $content, params }) {
  const lang = app.i18n.locale
  ...
  const pages = await $content(lang + '/post', { deep: true })
    .sortBy('createdAt', 'desc')
    .fetch()
  ...
  return {
    lang,
    ...
  }
```

nuxt-i18n で追加される `localePath()` を使って言語を問わないパスから対象言語のパスへ変換することができるので、同一言語の他のページへのリンク生成も問題なくできる。

dropdown で言語を選択するような UI は用意されていないため (テーマにはあるかもしれないがカスタマイズしたかったため試していない)、自分で実装する必要はある。

## Markdown の改行で HTML の改行ができるか

末尾にスペース2つで改行するのではなく、ただの改行で HTML の改行にしたい。
これは nuxt.config.js に remark-breaks の plugin を追加するだけだった。

```js
  content: {
    markdown: {
      remarkPlugins: [
        'remark-breaks',
      ],
```
## 英語版がない記事での 404 エラーを回避する

English のリンクが残っていると `nuxt generate` 時にエラーが発生するため、過去の記事については `noEnglish: true` というカスタムの frontmatter を挿入して英語ページへのリンクを生成しないようにした。

```bash
# 2010~2020の記事は英語版なし
find content/ja/post/20{10..20} -type f | xargs sed -i '' -e 's,^\(title:.*\),\1\nnoEnglish: true,'
```

`noEnglish` プロパティが `true` であれば英語版なし。二重否定でわかりにくいが、逆にしてしまうと今後の記事すべてに `hasEnglish: true` のような frontmatter を記述することになるので、過去分だけ対処すれば良いようにこのようにした。

```html
<nav-bar :path="toPath(article.path)" :has-english="!article.noEnglish" />
```

## ページネーション

ここでいうページネーションは一覧上のもの。
すぐ使えそうな library が見当たらなかったため、前後のページに移るだけの簡単なものを自前で実装。

asyncData ですべてのページを取得して、computed で 対象ページに限定した post を取り出す。現在のページは data で持たせておく。
ページが遷移したら上部にスクロールしてほしいので、 `window.scrollTo` を呼び出すようにした。

```js
export default {
  async asyncData ({ app, $content, params }) {
    const pages = await $content(lang + '/post', { deep: true })
      .sortBy('createdAt', 'desc')
      .fetch()
    return {
      lang,
      pages,
    }
  },
  data () {
    return {
      perPage: 20,
      page: 1
    }
  },
  computed: {
    paginated () {
      return this.pages.slice((this.page - 1) * this.perPage, this.page * this.perPage)
    }
  },
  methods: {
    setPage (page) {
      this.page = page
      window.scrollTo({ top: 0 })
    },
```

前後のページのリンクは Pagination という component として作成。
現在のページ、最大ページ数、ページが選択されたときのイベントハンドラを設定できるようにする。

```html
<div v-for="p of paginated" :key="p.path" class="post">
  <!-- ページ内のpostをレンダリング -->
</div>
<pagination :page="page" :max-page="Math.ceil(pages.length / perPage)" @setPage="setPage" />
```

Paginationの内容は以下のようなもの。
前後に遷移するが、遷移できるページがない場合は disabled になるようにした。

```vue
<template>
  <div class="pagination">
    <div>
      <a :class="{'is-disabled': prevDisabled}" @click="setPage(page - 1)">
        &lt;
      </a>
    </div>
    <div>
      <a :class="{'is-disabled': nextDisabled}" @click="setPage(page + 1)">
        &gt;
      </a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    page: {
      type: Number,
      required: true
    },
    maxPage: {
      type: Number,
      required: true
    }
  },
  computed: {
    prevDisabled () {
      return this.page === 1
    },
    nextDisabled () {
      return this.page === this.maxPage
    }
  },
  methods: {
    setPage (page) {
      this.$emit('setPage', page)
    }
  }
}
</script>
```

## sitemap

sitemap は `@nuxtjs/sitemap` で追加した。
コンテンツのパスを routes で定義する必要がある。
日英のパスを、英語なら `/en/` は入らない点に注意して生成する。

```js
sitemap: {
  hostname: baseUrl,
  gzip: true,
  routes: async () => {
    let routes = []
    const { $content } = require('@nuxt/content')
    const langs = ['en', 'ja']
    for (const lang of langs) {
      const posts = await $content(lang, 'post', { deep: true }).fetch()
      for (const post of posts) {
        const path = post.path.startsWith('/en/') ? post.path.replace(/^\/en/, '') : post.path
        routes.push(path + '/')
      }
    }
    return routes
  }
},
```

## RSS

[@nuxtjs/feed](https://www.npmjs.com/package/@nuxtjs/feed) を試したが、どうやらこれはちゃんと更新されていない模様。
[2.0.0 まで npm にはリリースされている](https://www.npmjs.com/package/@nuxtjs/feed/v/2.0.0)が、GitHub のリポジトリ上には [1.1.0 までしか定義されていない](https://github.com/nuxt-community/feed-module/releases/tag/v1.1.0)。さらには、2.0.0 では生成先のディレクトリが存在しないというエラーが発生してしまい、[それに対する PR がマージされている](https://github.com/nuxt-community/feed-module/pull/87)のだが、その修正版はリリースされていないようだった。

これに依存するのは微妙だと思い、[feed](https://www.npmjs.com/package/feed) を直接使って実装。
`generate:done` の hook を使った。

ここで、本文の HTML を Feed に含めたい場合に `<nuxt-content>` タグではなく JavaScript で HTML を取得する方法がわからなかった。
JSON AST を変換して生成するのが良いと考えて、[hast-util-to-html](https://github.com/syntax-tree/hast-util-to-html) での変換を試みたが、これは hast と若干異なっていて、`tagName` の代わりに `tag` というプロパティが定義されている。
AST を deep copy して `tagName` に置き換える操作をして hast として解釈できる形に補正して、その上で hast-util-to-html を使用して HTML に変換した。

```js
'generate:done': async () => {
  const { $content } = require('@nuxt/content')
  const langs = ['en', 'ja']
  for (const lang of langs) {
    const posts = await $content(lang, 'post', { deep: true })
      .sortBy('createdAt', 'desc')
      .limit(20)
      .fetch()
    const feed = new Feed({
      id: baseUrl,
      title: 'ブログのタイトル',
    })
    for (const post of posts) {
      const postPath = post.path.startsWith('/en/') ? post.path.replace(/^\/en/, '') : post.path
      const url = baseUrl + postPath

      const cloned = clonedeep(post.body)
      function processNode(node) {
        if (node.tag) {
            const tag = node.tag
            delete node.tag
            node.tagName = tag
        }
        if (node.children) {
            node.children.map(child => processNode(child))
        }
      }
      cloned.children.map(child => processNode(child))

      feed.addItem({
        title: post.title,
        description: post.description,
        id: url,
        link: url,
        content: toHtml(cloned),
        date: new Date(post.createdAt),
        updated: new Date(post.updatedAt)
      })
    }

    const localePath = lang === 'en' ? '' : '/' + lang
    const dir = __dirname + '/dist' + localePath
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(dir + '/feed.xml', feed.atom1())
  }
}
```

長い道のりだったが、これで以前とほぼ同様の内容を維持して移行することができた。
ちなみに、PageSpeed Insightのパフォーマンスのスコアは約70。だいぶ改善したが、さらに改善が必要だ :sweat_smile:

[^1]: 実際にはこれは HTML としてではなくテキストして抽出するため、期待するものではなかったのだが。
[^2]: 理解を進めていくうちに、これは [hast](https://github.com/syntax-tree/hast) なのかと思ったが、微妙に加工されていて hast ではないらしい。nuxt/content のドキュメントに書かれている JSON AST という表現が正しいのかな...
[^3]: [VuePressの.htmlのsuffixを削除しつつ作成日を表示する](/ja/post/2021/02/change-suffix-and-show-created/)
[^4]: [defaultLocale](https://i18n.nuxtjs.org/options-reference#defaultlocale)
